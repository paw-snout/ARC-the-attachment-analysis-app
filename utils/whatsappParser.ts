export type Message = {
    timestamp: Date;
    sender: string;
    text: string;
};

/**
 * Parses raw WhatsApp export text content into a structured array of Message objects.
 * Supports various international formats from Android and iOS.
 * 
 * Android: 25/05/2021, 18:25 - Name: Message
 * iOS: [25/05/21, 18:25:33] Name: Message
 */
export function parseWhatsAppChat(content: string): Message[] {
    const messages: Message[] = [];
    const lines = content.split(/\r?\n/);

    /**
     * Universal WhatsApp Message Regex
     * Captures:
     * 1. Date string (Flexible format)
     * 2. Time string (Flexible, supports AM/PM)
     * 3. Sender Name
     * 4. Message Content
     * 
     * Handles optional brackets [ ] and hyphen separators.
     */
    const lineRegex = /^\[?(\d{1,4}[-/.]\d{1,2}[-/.]\d{2,4}),?\s+(\d{1,2}:\d{2}(?::\d{2})?(?:\s?[ap]m)?)\]?[\s-]*([^:]+):\s+(.*)$/i;

    let currentMessage: Message | null = null;

    for (const line of lines) {
        if (!line.trim()) continue;

        const match = line.match(lineRegex);

        if (match) {
            const [_, dateStr, timeStr, sender, text] = match;

            // Filter out system messages that don't have a real sender (e.g. "Messages are encrypted")
            // These usually don't match because they lack the "Name:" pattern, but we check just in case.
            if (sender.includes('added') || sender.includes('changed') || sender.includes('created')) {
                if (!line.includes(':')) continue;
            }

            const timestamp = parseTimestamp(dateStr, timeStr);

            if (timestamp && !isNaN(timestamp.getTime())) {
                if (currentMessage) {
                    messages.push(currentMessage);
                }
                currentMessage = {
                    timestamp,
                    sender: sender.trim(),
                    text: text.trim()
                };
            } else if (currentMessage) {
                // If date parsing fails but we have a running message, it's likely a multi-line continuation
                currentMessage.text += '\n' + line;
            }
        } else if (currentMessage) {
            // Continuation of previous multi-line message
            currentMessage.text += '\n' + line;
        }
    }

    // Push the final message
    if (currentMessage) {
        messages.push(currentMessage);
    }

    return messages;
}

/**
 * Efficiently parses date and time strings into a JS Date object.
 * Handles DD/MM vs MM/DD variance by checking common patterns.
 */
function parseTimestamp(dateStr: string, timeStr: string): Date | null {
    const normalizedDate = dateStr.replace(/[.-]/g, '/');

    // Optimization: Try simple constructor first
    const date = new Date(`${normalizedDate} ${timeStr}`);
    if (!isNaN(date.getTime())) return date;

    // Fallback for tricky formats (e.g. 25/05/2021)
    const parts = normalizedDate.split('/');
    if (parts.length === 3) {
        const [p1, p2, p3] = parts.map(Number);
        // If p1 > 12, it must be DD/MM/YYYY
        if (p1 > 12) {
            return new Date(p3 < 100 ? 2000 + p3 : p3, p2 - 1, p1, ...parseTimeParts(timeStr));
        }
    }

    return null;
}

function parseTimeParts(timeStr: string): [number, number, number] {
    const [hms, ampm] = timeStr.toLowerCase().split(/\s+/);
    const parts = hms.split(':').map(Number);
    let hours = parts[0];
    const minutes = parts[1] || 0;
    const seconds = parts[2] || 0;

    if (ampm === 'pm' && hours < 12) hours += 12;
    if (ampm === 'am' && hours === 12) hours = 0;

    return [hours, minutes, seconds];
}
