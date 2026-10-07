export interface SharePayload {
  title: string;
  text: string;
  url: string;
}

export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.left = '-9999px';
      document.body.appendChild(textarea);
      textarea.select();
      const success = document.execCommand('copy');
      document.body.removeChild(textarea);
      return success;
    }
  } catch (err) {
    console.error('Failed to copy text: ', err);
    return false;
  }
};

export const shareResult = async (payload: SharePayload): Promise<'shared' | 'copied' | 'failed'> => {
  if (navigator.share) {
    try {
      await navigator.share(payload);
      return 'shared';
    } catch (err: any) {
      if (err.name === 'AbortError') {
        return 'failed';
      }
    }
  }
  // Fallback to copy link & summary
  const copyText = `${payload.title}: ${payload.text}\nTry it at: ${payload.url}`;
  const copied = await copyToClipboard(copyText);
  return copied ? 'copied' : 'failed';
};
