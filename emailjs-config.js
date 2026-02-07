
const EMAILJS_CONFIG = {
    // Your EmailJS Public Key
    publicKey: 'yp0ihX-TrRBRQeC8O',

    // Your Gmail Service ID
    serviceID: 'service_rsem54o',

    // Template IDs for different forms
    templates: {
        enquiry: 'template_ad1l3mv',   // For the Quote Machine / Contact Form
        testimonial: 'template_ad1l3mv' // Using same ID for now, user can update this later
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = EMAILJS_CONFIG;
}
