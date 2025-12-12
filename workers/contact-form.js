/**
 * Cloudflare Worker - Contact Form Handler
 * Sends emails via Resend API
 *
 * Environment Variables Required:
 * - RESEND_API_KEY: Your Resend API key
 * - TO_EMAIL: Email address to receive submissions
 *
 * Optional (recommended):
 * - ALLOWED_ORIGINS: Comma-separated list of allowed browser origins
 * - TURNSTILE_SECRET_KEY: Cloudflare Turnstile secret key (enables bot protection)
 * - FROM_EMAIL: Verified Resend sender email
 * - FROM_NAME: Display name for sender
 */

export default {
  async fetch(request, env) {
    const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const allowedOrigins = (env.ALLOWED_ORIGINS || 'https://lonestarfauxscapes.com,https://www.lonestarfauxscapes.com')
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    const origin = request.headers.get('Origin');
    const originAllowed = !origin || allowedOrigins.includes(origin);

    const corsHeaders = origin && originAllowed ? {
      'Access-Control-Allow-Origin': origin,
      'Vary': 'Origin',
    } : {};

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      if (!originAllowed) return new Response(null, { status: 403 });
      return new Response(null, {
        status: 204,
        headers: {
          ...corsHeaders,
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Max-Age': '86400',
        },
      });
    }

    // Only accept POST
    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', ...corsHeaders },
      });
    }

    try {
      if (!originAllowed) {
        return new Response(JSON.stringify({ error: 'Origin not allowed' }), {
          status: 403,
          headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
        });
      }

      const body = await request.json().catch(() => null);
      if (!body || typeof body !== 'object') {
        return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', ...corsHeaders },
        });
      }

      const honeypot = String(body.website || '').trim();
      if (honeypot) {
        return new Response(JSON.stringify({ success: true, message: 'Message received' }), {
          status: 200,
          headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', ...corsHeaders },
        });
      }

      const name = String(body.name || '').trim().slice(0, 80);
      const email = String(body.email || '').trim().slice(0, 254);
      const phone = String(body.phone || '').trim().slice(0, 40);
      const service = String(body.service || '').trim().slice(0, 120);
      const message = String(body.message || '').trim().slice(0, 5000);
      const turnstileToken = String(body.turnstileToken || '').trim().slice(0, 2048);

      // Validate required fields
      if (!name || !email || !message) {
        return new Response(JSON.stringify({ error: 'Missing required fields' }), {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store',
            ...corsHeaders,
          },
        });
      }

      if (!EMAIL_REGEX.test(email)) {
        return new Response(JSON.stringify({ error: 'Invalid email address' }), {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store',
            ...corsHeaders,
          },
        });
      }

      // Optional Turnstile verification (recommended)
      if (env.TURNSTILE_SECRET_KEY) {
        if (!turnstileToken) {
          return new Response(JSON.stringify({ error: 'Missing Turnstile token' }), {
            status: 400,
            headers: {
              'Content-Type': 'application/json',
              'Cache-Control': 'no-store',
              ...corsHeaders,
            },
          });
        }

        const verifyBody = new URLSearchParams({
          secret: env.TURNSTILE_SECRET_KEY,
          response: turnstileToken,
        });

        const remoteIp = request.headers.get('CF-Connecting-IP');
        if (remoteIp) verifyBody.set('remoteip', remoteIp);

        const verifyResponse = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: verifyBody,
        });

        const verifyJson = await verifyResponse.json().catch(() => null);
        if (!verifyResponse.ok || !verifyJson?.success) {
          return new Response(JSON.stringify({ error: 'Failed Turnstile verification' }), {
            status: 403,
            headers: {
              'Content-Type': 'application/json',
              'Cache-Control': 'no-store',
              ...corsHeaders,
            },
          });
        }
      }

      // Build email content
      const emailBody = `
New contact form submission from Lone Star Faux Scapes website:

Name: ${name}
Email: ${email}
Phone: ${phone || 'Not provided'}
Service Interest: ${service || 'Not specified'}

Message:
${message}

---
Submitted at: ${new Date().toLocaleString('en-US', { timeZone: 'America/Chicago' })} (Central Time)
      `.trim();

      // Send via Resend
      const fromEmail = env.FROM_EMAIL || 'onboarding@resend.dev';
      const fromName = env.FROM_NAME || 'Lone Star Faux Scapes';

      const resendResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: `${fromName} <${fromEmail}>`,
          to: env.TO_EMAIL,
          subject: '[LONESTAR CONTACT SUBMISSION] New inquiry from ' + name,
          text: emailBody,
          reply_to: email,
        }),
      });

      if (!resendResponse.ok) {
        const error = await resendResponse.text();
        console.error('Resend error:', error);
        return new Response(JSON.stringify({ error: 'Failed to send email' }), {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store',
            ...corsHeaders,
          },
        });
      }

      return new Response(JSON.stringify({ success: true, message: 'Message sent successfully!' }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store',
          ...corsHeaders,
        },
      });

    } catch (error) {
      console.error('Worker error:', error);
      return new Response(JSON.stringify({ error: 'Internal server error' }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store',
          ...corsHeaders,
        },
      });
    }
  },
};
