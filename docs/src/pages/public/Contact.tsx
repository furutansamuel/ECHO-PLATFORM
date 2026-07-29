import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { useDocumentTitle } from '@/hooks/use-document-title';

import {
  Mail,
  Phone,
  MapPin,
  ChevronDown,
  HelpCircle,
} from "lucide-react";


export default function ContactPage() {
  useDocumentTitle(
    'Contact Us',
    'Have a question, suggestion, or want to partner with ECHO? Get in touch with our team.'
  );
  return (
    <div className="bg-background">
    {/* Hero */}
<section className="relative overflow-hidden py-20 bg-gradient-to-br from-primary/5 via-background to-success">

  <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-primary/10 blur-3xl"></div>

  <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-success-subtle/20 blur-3xl"></div>

  <div className="container mx-auto px-4 text-center relative">

    <span className="inline-flex items-center rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
      Contact ECHO
    </span>

    <h1 className="mt-6 text-4xl font-black text-primary md:text-6xl">
      We'd Love to Hear
      <span className="block text-success">
        From You
      </span>
    </h1>

    <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-muted-foreground">
      Whether you have a question, feedback, partnership proposal,
      or need support using ECHO, we're always happy to connect with
      citizens, organisations, researchers, and environmental advocates.
    </p>

  </div>

</section>

<section className="py-16">
  <div className="container mx-auto px-4">
    <div className="grid md:grid-cols-2 gap-16 items-start">

      {/* LEFT COLUMN */}
      <div className="space-y-6">

        {/* Intro */}
        <div>
          <h2 className="text-3xl font-bold text-primary">
            Get in Touch
          </h2>

          <p className="mt-3 text-muted-foreground leading-7">
            We'd love to hear your ideas, feedback, partnership proposals,
            or answer any questions about ECHO. Your message helps us build
            a stronger environmental community.
          </p>
        </div>

        {/* Location */}
        <Card className="border-0 shadow-md hover:shadow-xl transition-all duration-300">
          <CardContent className="flex items-start gap-4 p-6">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
              <MapPin className="h-7 w-7 text-primary" />
            </div>

            <div>
              <h3 className="text-lg font-bold">Location</h3>

              <p className="mt-2 text-muted-foreground">
                Lafia, Nasarawa State
              </p>

              <p className="text-muted-foreground">
                Nigeria
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Email */}
        <Card className="border-0 shadow-md hover:shadow-xl transition-all duration-300">
          <CardContent className="flex items-start gap-4 p-6">

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
              <Mail className="h-7 w-7 text-primary" />
            </div>

            <div>
              <h3 className="text-lg font-bold">Email</h3>

              <p className="mt-2 text-muted-foreground">
                Replace this with your email
              </p>

              <a
                href="mailto:your@email.com"
                className="text-primary hover:underline"
              >
                your@email.com
              </a>
            </div>

          </CardContent>
        </Card>

        {/* Partnership */}
        <Card className="border-0 shadow-md hover:shadow-xl transition-all duration-300">
          <CardContent className="flex items-start gap-4 p-6">

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
              <Phone className="h-7 w-7 text-primary" />
            </div>

            <div>
              <h3 className="text-lg font-bold">
                Partnerships & Collaboration
              </h3>

              <p className="mt-2 text-muted-foreground leading-7">
                Interested in collaborating with ECHO on environmental
                initiatives, research, education or community projects?
                We'd be happy to connect.
              </p>
            </div>

          </CardContent>
        </Card>

      </div>

      {/* RIGHT COLUMN */}
      <Card className="border-0 rounded-3xl shadow-xl">
        <CardContent className="p-8 md:p-10">

      <div className="mb-8">
      <span className="inline-flex rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
        Send us a Message
      </span>

      <h2 className="mt-4 text-3xl font-bold text-primary">
        We'd Love Your Feedback
      </h2>

      <p className="mt-3 text-muted-foreground leading-7">
        Share your questions, suggestions, partnership ideas, or report an issue
        about the platform. We'll get back to you as soon as possible.
      </p>
    </div>

    <form className="space-y-6">

      {/* Name */}
      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-semibold">
          Full Name
        </label>

        <Input
          id="name"
          placeholder="Enter your full name"
        />
      </div>

      {/* Email */}
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-semibold">
          Email Address
        </label>

        <Input
          id="email"
          type="email"
          placeholder="example@email.com"
        />
      </div>
      {/* Organisation */}
      <div className="space-y-2">
        <label
          htmlFor="organisation"
          className="text-sm font-semibold"
        >
          Organisation <span className="text-muted-foreground">(Optional)</span>
        </label>

        <Input
          id="organisation"
          placeholder="Organisation or Institution"
        />
      </div>

      {/* Subject */}
      <div className="space-y-2">
        <label htmlFor="subject" className="text-sm font-semibold">
          Subject
        </label>

        <Input
          id="subject"
          placeholder="What would you like to discuss?"
        />
      </div>

      {/* Message */}
      <div className="space-y-2">
        <label htmlFor="message" className="text-sm font-semibold">
          Message
        </label>

        <Textarea
          id="message"
          rows={6}
          placeholder="Type your message here..."
        />
      </div>
      {/* Button */}
      <Button
        type="submit"
        size="lg"
        className="w-full rounded-xl h-12"
      >
        Send Message
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        We typically respond within <strong>24–48 hours</strong>.
      </p>

    </form>
        </CardContent>
      </Card>

    </div>
  </div>
</section>
      
      
    {/* FAQ Section */}
<section className="py-20 bg-primary/5">

  <div className="container mx-auto max-w-4xl px-4">

    <div className="text-center mb-12">

      <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
        <HelpCircle className="h-4 w-4" />
        Frequently Asked Questions
      </span>

      <h2 className="mt-5 text-3xl md:text-4xl font-bold text-primary">
        Have Questions?
      </h2>

      <p className="mt-3 text-muted-foreground">
        Here are answers to some common questions about ECHO.
      </p>

    </div>

    <div className="space-y-4">

      {/* FAQ 1 */}
      <details className="group rounded-2xl border bg-background p-6 shadow-sm transition-all open:shadow-md">

        <summary className="flex cursor-pointer list-none items-center justify-between font-semibold">
          How do I report an environmental hazard?
          <ChevronDown className="h-5 w-5 transition-transform group-open:rotate-180" />
        </summary>

        <p className="mt-4 text-muted-foreground leading-7">
          Click the <strong>Report a Hazard</strong> button, choose the
          appropriate category, provide the location, upload photos if
          available, and submit your report.
        </p>

      </details>

      {/* FAQ 2 */}
      <details className="group rounded-2xl border bg-background p-6 shadow-sm transition-all open:shadow-md">

        <summary className="flex cursor-pointer list-none items-center justify-between font-semibold">
          Is ECHO free to use?
          <ChevronDown className="h-5 w-5 transition-transform group-open:rotate-180" />
        </summary>

        <p className="mt-4 text-muted-foreground leading-7">
          Yes. ECHO is free for citizens to report environmental hazards,
          monitor community issues, and support environmental action.
        </p>

      </details>

      {/* FAQ 3 */}
      <details className="group rounded-2xl border bg-background p-6 shadow-sm transition-all open:shadow-md">

        <summary className="flex cursor-pointer list-none items-center justify-between font-semibold">
          Can organisations partner with ECHO?
          <ChevronDown className="h-5 w-5 transition-transform group-open:rotate-180" />
        </summary>

        <p className="mt-4 text-muted-foreground leading-7">
          Absolutely. We welcome collaborations with schools, NGOs,
          researchers, government agencies, environmental organisations,
          and community groups working toward a cleaner and healthier
          environment.
        </p>

      </details>

      {/* FAQ 4 */}
      <details className="group rounded-2xl border bg-background p-6 shadow-sm transition-all open:shadow-md">

        <summary className="flex cursor-pointer list-none items-center justify-between font-semibold">
          Where is ECHO based?
          <ChevronDown className="h-5 w-5 transition-transform group-open:rotate-180" />
        </summary>

        <p className="mt-4 text-muted-foreground leading-7">
          ECHO is based in <strong>Lafia, Nasarawa State, Nigeria</strong>,
          with a vision of supporting cleaner, healthier, and more resilient
          communities across the country.
        </p>

      </details>

    </div>

  </div>

</section>
    </div>
  );
}
