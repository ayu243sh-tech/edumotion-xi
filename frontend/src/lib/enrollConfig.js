// Settings for the enrolment page.
export const ENROLL = {
  fee: 2500,
  payeeName: "EduMotion",
  upiId: "",             // your UPI ID, e.g. "name@upi". Adds a "Pay with UPI app" button on phones
  qrImage: "/payment-qr.png",   // put your QR image in the public folder with this name
  whatsapp: "",          // country code + number, no + or spaces, e.g. "919876543210"
  note: "Your seat is confirmed after we verify your payment.",
  includes: [            // edit to match what students really get
    "Live classes with your chosen teachers",
    "Recordings of every class",
    "Doubt box after each class",
  ],
};
