import { motion } from "framer-motion";
import { Check, Zap, Shield, Clock } from "lucide-react";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PricingPlans } from "@/constants";
import { useAuth } from "@/hooks";
import { useNavigate } from "react-router-dom";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function PricingPage() {
  const { isAuth } = useAuth();
  const navigate = useNavigate();

  const handleClick = () => {
    if (isAuth) return navigate("/dashboard/profile");
    else return navigate("/auth/sign-in");
  };

  return (
    <section className="py-8 md:py-10">
      <div className="container mx-auto px-4 sm:px-0">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Pricing Plans
          </span>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-primary mb-4">
            Choose your plan
          </h1>
          <p className="text-sm sm:text-xl text-muted-foreground mb-6">
            Unlock endless possibilities with our flexible pricing options
          </p>
          <div className="flex flex-col sm:flex-row text-foreground items-center justify-center gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4 text-primary" />
              <span>14-day free trial</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-primary" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center space-x-2">
              <Zap className="h-4 w-4 text-primary" />
              <span>Cancel anytime</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {PricingPlans.map((plan) => (
            <motion.div
              key={plan.name}
              variants={itemVariants}
              className="flex"
            >
              <Card
                className={`relative flex flex-col w-full transition-all duration-300 hover:shadow-xl hover:scale-105 ${
                  plan.popular
                    ? "bg-primary text-primary-foreground border-primary"
                    : ""
                }`}
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-lg font-medium mb-2">{plan.name}</p>
                      <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-bold">{plan.title}</span>
                        {plan.period && (
                          <span className="text-lg font-medium opacity-80">
                            {plan.period}
                          </span>
                        )}
                      </div>
                    </div>
                    {plan.popular && (
                      <Badge
                        variant="secondary"
                        className="bg-green-500/20 text-green-500 border-green-500/20"
                      >
                        Most Popular
                      </Badge>
                    )}
                  </div>
                  <p
                    className={`mt-4 text-sm ${
                      plan.popular
                        ? "text-primary-foreground/80"
                        : "text-muted-foreground"
                    }`}
                  >
                    {plan.description}
                  </p>
                  {plan.savings && (
                    <Badge
                      variant="secondary"
                      className="mt-2 w-full justify-center text-center"
                    >
                      {plan.savings}
                    </Badge>
                  )}
                </CardHeader>
                <CardContent className="flex-grow">
                  <div className="space-y-4">
                    <p
                      className={`font-medium ${
                        plan.popular
                          ? "text-primary-foreground"
                          : "text-foreground"
                      }`}
                    >
                      Key features
                    </p>
                    <ul className="space-y-3">
                      {plan.features.map((feature) => (
                        <li
                          key={feature.text}
                          className="flex items-center gap-3"
                        >
                          <feature.icon className="h-5 w-5 flex-shrink-0" />
                          <span className="text-sm">{feature.text}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="pt-4 space-y-2">
                      <p
                        className={`font-medium ${
                          plan.popular
                            ? "text-primary-foreground"
                            : "text-foreground"
                        }`}
                      >
                        Also included:
                      </p>
                      <ul className="space-y-2">
                        {plan.highlights.map((highlight) => (
                          <li
                            key={highlight}
                            className="flex items-center gap-2 text-sm"
                          >
                            <Check className="h-4 w-4 flex-shrink-0" />
                            <span>{highlight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    variant={plan.popular ? "secondary" : "default"}
                    className="w-full"
                    size="lg"
                    onClick={handleClick}
                  >
                    {plan.button.text}
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
