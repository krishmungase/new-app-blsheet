import { FAQ } from "@/constants";
import { motion } from "framer-motion";
import { ArrowBigRight } from "lucide-react";

const FAQSection = () => {
  return (
    <section className="bg-muted py-8 sm:py-16">
      <div className="container px-4 sm:px-0 mx-auto">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h2 className="text-2xl md:text-4xl font-bold mb-2">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground mb-8">
            Have questions? We're here to help.
          </p>
          <div className="grid md:grid-cols-2 gap-6 text-left">
            {FAQ.map((faq, i) => (
              <div
                key={i}
                className="space-y-2 p-3 rounded-lg border border-gray-400/20 shadow-[5px_5px_0px_0px_rgba(16,23,42)] dark:shadow-[5px_5px_0px_0px_rgba(128,133,142)]"
              >
                <h3 className="font-semibold">
                  {i + 1}.{faq.q}
                </h3>
                <div className="flex items-center gap-2">
                  <div>
                    <ArrowBigRight size={15} />
                  </div>
                  <p className="text-sm">{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQSection;
