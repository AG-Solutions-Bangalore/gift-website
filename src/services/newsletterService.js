/**
 * Newsletter Service to subscribe emails via CRM API (createnewsletter)
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://memorycreators.in/crmapi/public/api';
const API_TOKEN = import.meta.env.VITE_API_TOKEN || '';

/**
 * Subscribe email to newsletter
 * @param {string} email
 */
export async function createNewsletter(emailOrPayload) {
  try {
    const email = typeof emailOrPayload === 'object' && emailOrPayload !== null
      ? (emailOrPayload.newsletter_email || emailOrPayload.email || '')
      : (emailOrPayload || '');

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      throw new Error('Please enter a valid email address.');
    }

    const endpoint = `${API_BASE_URL.replace(/\/+$/, '')}/createnewsletter`;
    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    };

    if (API_TOKEN) {
      headers['Authorization'] = `Bearer ${API_TOKEN}`;
    }

    const response = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        newsletter_email: email.trim(),
      }),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok || (data && data.code && data.code >= 400)) {
      const msg = data?.message || data?.data?.message || data?.error || `HTTP ${response.status}: Failed to subscribe`;
      throw new Error(msg);
    }

    return {
      success: true,
      data,
      message: data?.message || data?.data?.message || 'Thank you for subscribing to our newsletter!',
    };
  } catch (error) {
    console.error('Failed to subscribe newsletter:', error);
    return {
      success: false,
      error: error.message || 'Subscription failed. Please try again.',
    };
  }
}
