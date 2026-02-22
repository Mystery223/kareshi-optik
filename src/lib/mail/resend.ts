import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface MailData {
    customerName: string;
    bookingCode: string;
    date: string;
    time: string;
    serviceType: string;
    email: string;
}

export async function sendBookingConfirmation({
    customerName,
    bookingCode,
    date,
    time,
    serviceType,
    email,
}: MailData) {
    if (!process.env.RESEND_API_KEY || !email) return;

    try {
        await resend.emails.send({
            from: `Kareshi Optik <${process.env.FROM_EMAIL}>`,
            to: [email],
            subject: `Konfirmasi Booking: ${bookingCode} - Kareshi Optik`,
            html: `
        <div style="font-family: serif; max-width: 600px; margin: 0 auto; color: #1a1a1a;">
          <h1 style="color: #e11d48; font-style: italic;">Kareshi Optik</h1>
          <p>Halo <strong>${customerName}</strong>,</p>
          <p>Terima kasih telah melakukan reservasi di Kareshi Optik. Berikut adalah rincian janji temu Anda:</p>
          <div style="background: #fdfaf9; padding: 25px; border-radius: 20px; border: 1px solid #f3e8e6;">
            <p style="margin: 0; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; color: #666;">Booking Code</p>
            <h2 style="margin: 5px 0 20px 0; font-size: 32px;">${bookingCode}</h2>
            
            <p><strong>Layanan:</strong> ${serviceType}</p>
            <p><strong>Tanggal:</strong> ${date}</p>
            <p><strong>Waktu:</strong> ${time}</p>
          </div>
          <p style="margin-top: 30px; font-size: 14px; color: #666; font-style: italic;">
            Harap datang 10 menit sebelum jadwal. Jika ingin melakukan perubahan jadwal, silakan hubungi kami via WhatsApp.
          </p>
        </div>
      `,
        });
    } catch (error) {
        console.error('[RESEND_ERROR]', error);
    }
}

export async function sendAdminNotification({
    customerName,
    bookingCode,
    date,
    time,
    serviceType,
}: Omit<MailData, 'email'>) {
    if (!process.env.RESEND_API_KEY || !process.env.ADMIN_EMAIL) return;

    try {
        await resend.emails.send({
            from: `Kareshi System <${process.env.FROM_EMAIL}>`,
            to: [process.env.ADMIN_EMAIL],
            subject: `[BOOKING BARU] ${bookingCode} - ${customerName}`,
            html: `
        <h3>Ada Janji Temu Baru!</h3>
        <p><strong>Customer:</strong> ${customerName}</p>
        <p><strong>Jadwal:</strong> ${date} pukul ${time}</p>
        <p><strong>Layanan:</strong> ${serviceType}</p>
        <p><strong>Kode:</strong> ${bookingCode}</p>
        <hr />
        <p>Silakan cek dashboard admin untuk detail lengkap.</p>
      `,
        });
    } catch (error) {
        console.error('[RESEND_ADMIN_ERROR]', error);
    }
}
