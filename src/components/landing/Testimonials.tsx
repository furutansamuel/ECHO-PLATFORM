import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const testimonials = [
  {
    name: 'Amina J. Mohammed',
    role: 'Citizen, Lagos',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    testimonial: 'Using ECHO to report an illegal dumpsite in my area was incredibly easy. I saw action taken within a week! It feels empowering to have a tool that truly connects us to local authorities.'
  },
  {
    name: 'Chinedu Okoro',
    role: 'Volunteer, Abuja',
    avatar: 'https://randomuser.me/api/portraits/men/46.jpg',
    testimonial: "I love being part of the ECHO community. I've joined several cleanup events through the platform and met amazing people. It's rewarding to see the direct impact of our work."
  },
  {
    name: 'Dr. Funmilayo Adebayo',
    role: 'Community Leader, Ibadan',
    avatar: 'https://randomuser.me/api/portraits/women/47.jpg',
    testimonial: "The Community Health Score feature is revolutionary. It gives us the data we need to advocate for resources and make informed decisions for our community's environmental future. ECHO is a game-changer."
  }
];

export function Testimonials() {
  return (
    <section className="py-12 lg:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-primary">From the Community, For the Community</h2>
          <p className="text-lg text-muted-foreground mt-2">Real stories from people making a difference with ECHO.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.name} className="p-6 text-center premium-shadow border">
              <CardContent className="p-0">
                <p className="text-muted-foreground italic mb-6">"{testimonial.testimonial}"</p>
                <div className="flex items-center justify-center">
                    <Avatar className="h-12 w-12 mr-4">
                        <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                        <AvatarFallback>{testimonial.name.substring(0,2)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="font-bold">{testimonial.name}</p>
                        <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
