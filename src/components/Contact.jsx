// src/components/Contact.jsx
import React from "react";

const Contact = () => {
  return (
    <section
      id="contact"
      className="relative bg-gradient-to-b from-white via-blue-50 to-white py-16 md:py-20"
    >
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <p className="text-sm md:text-base font-semibold uppercase tracking-[0.25em] text-blue-600">
            Contact Us
          </p>
          <h2 className="mt-3 text-3xl md:text-4xl font-extrabold text-blue-900">
            Springfield Golden Tulip Academy
          </h2>
          <div className="mt-4 w-24 h-1 bg-yellow-400 mx-auto rounded-full" />
          <p className="mt-5 text-slate-600 text-sm md:text-base leading-relaxed">
            We are here to help with admissions, enquiries, and general
            information.
          </p>
        </div>

        <div className="bg-white border border-blue-100 shadow-xl rounded-3xl overflow-hidden">
          <div className="grid md:grid-cols-2">
            <div className="bg-blue-900 text-white p-8 md:p-10">
              <p className="text-xs md:text-sm uppercase tracking-[0.25em] text-yellow-300 font-semibold">
                Our Details
              </p>

              <h3 className="mt-3 text-2xl md:text-3xl font-extrabold leading-snug">
                SPRINGFIELD GOLDEN TULIP ACADEMY
              </h3>

              <div className="mt-8 space-y-6">
                <div>
                  <p className="text-yellow-300 text-xs uppercase tracking-[0.2em] font-semibold">
                    Address
                  </p>
                  <p className="mt-2 text-sm md:text-base leading-relaxed text-white/90">
                    SPRINGFIELD GOLDEN TULIP ACADEMY, Yakubu Gowon Way (off NTA
                    Headquarters), Jos, Plateau State.
                  </p>
                </div>

                <div>
                  <p className="text-yellow-300 text-xs uppercase tracking-[0.2em] font-semibold">
                    Telephone
                  </p>
                  <a
                    href="tel:+2348033353059"
                    className="mt-2 block text-sm md:text-base text-white/90 hover:text-yellow-300 transition"
                  >
                    +2348033353059
                  </a>
                </div>

                <div>
                  <p className="text-yellow-300 text-xs uppercase tracking-[0.2em] font-semibold">
                    Email
                  </p>
                  <a
                    href="mailto:Springfieldshools12@gmail.com"
                    className="mt-2 block text-sm md:text-base text-white/90 break-all hover:text-yellow-300 transition"
                  >
                    Springfieldshools12@gmail.com
                  </a>
                </div>
              </div>
            </div>

            <div className="p-8 md:p-10 flex items-center">
              <div className="w-full">
                <div className="inline-flex items-center gap-2 bg-yellow-100 text-blue-900 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-[0.2em]">
                  Reach Out Anytime
                </div>

                <h3 className="mt-5 text-2xl md:text-3xl font-extrabold text-blue-900 leading-snug">
                  We would love to hear from you
                </h3>

                <p className="mt-4 text-slate-600 text-sm md:text-base leading-relaxed">
                  For enquiries about admission, academics, or school
                  activities, please contact Springfield Golden Tulip Academy
                  through our phone number or email address.
                </p>

                <div className="mt-8 flex flex-col sm:flex-row gap-4">
                  <a
                    href="tel:+2348033353059"
                    className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-yellow-400 text-blue-900 font-semibold hover:bg-yellow-300 transition shadow-md"
                  >
                    Call School
                  </a>

                  <a
                    href="mailto:Springfieldshools12@gmail.com"
                    className="inline-flex items-center justify-center px-6 py-3 rounded-full border-2 border-blue-900 text-blue-900 font-semibold hover:bg-blue-900 hover:text-white transition"
                  >
                    Send Email
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;