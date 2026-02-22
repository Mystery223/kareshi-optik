/**
 * Menghasilkan link WhatsApp Click-to-Chat
 */
export function generateWhatsAppLink(phone: string, message: string) {
    const cleanPhone = phone.replace(/\D/g, ''); // Ambil hanya angka
    // Format ke standar internasional (misal 08 -> 628)
    const formattedPhone = cleanPhone.startsWith('0')
        ? `62${cleanPhone.substring(1)}`
        : cleanPhone;

    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${formattedPhone}?text=${encodedMessage}`;
}

export const WA_TEMPLATES = {
    CONFIRM_BOOKING: (code: string, name: string, date: string, time: string) =>
        `Halo Kareshi Optik, saya ${name} ingin mengonfirmasi booking janji temu saya dengan kode: ${code} untuk tanggal ${date} pada jam ${time}.`,
};
