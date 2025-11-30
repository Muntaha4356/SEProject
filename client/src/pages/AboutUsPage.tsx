import { Link } from "react-router-dom";
import { Heart, Target, Users, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

const AboutUsPage = () => {
  
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl">
            <Heart className="h-6 w-6 text-primary fill-primary" />
            <span className="bg-gradient-primary bg-clip-text text-transparent">FundRaise</span>
          </Link>
          
          <div className="flex items-center gap-6">
            <Link to="/careers" className="text-foreground/80 hover:text-foreground transition-colors">
              Careers
            </Link>
            <Link to="/about" className="text-foreground/80 hover:text-foreground transition-colors">
              About Us
            </Link>
            <Button onClick={() => window.location.href = "/signin"}>
              Sign In
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-24 bg-gradient-to-b from-primary/5 to-background">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="text-5xl md:text-6xl font-bold">
              About <span className="bg-gradient-primary bg-clip-text text-transparent">FundRaise</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              We're on a mission to make fundraising transparent, accessible, and impactful for everyone.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16">
        <div className="container">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="space-y-4 p-6 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Target className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Our Mission</h3>
              <p className="text-muted-foreground">
                Empowering communities through transparent and effective fundraising solutions.
              </p>
            </div>

            <div className="space-y-4 p-6 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Community First</h3>
              <p className="text-muted-foreground">
                Building a platform where every voice matters and every contribution counts.
              </p>
            </div>

            <div className="space-y-4 p-6 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Trust & Safety</h3>
              <p className="text-muted-foreground">
                Ensuring secure transactions and verified campaigns for peace of mind.
              </p>
            </div>

            <div className="space-y-4 p-6 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Heart className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Impact Driven</h3>
              <p className="text-muted-foreground">
                Creating meaningful change through collective generosity and compassion.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <div className="max-w-4xl mx-auto space-y-8">
            <h2 className="text-3xl font-bold text-center">Our Story</h2>
            <div className="prose prose-lg max-w-none text-muted-foreground space-y-4">
              <p>
                FundRaise was born from a simple belief: that everyone deserves access to the resources they need to make a difference. 
                Whether it's supporting a local community project, responding to emergencies, or funding innovative solutions to global challenges, 
                we believe that collective action can create extraordinary impact.
              </p>
              <p>
                Founded in 2024, our platform has helped thousands of organizations and individuals raise funds for causes that matter. 
                We've built a community of changemakers who believe in transparency, accountability, and the power of giving.
              </p>
              <p>
                Today, FundRaise continues to grow, connecting donors with causes they care about and providing organizations with the 
                tools they need to run successful fundraising campaigns. Every day, we're inspired by the generosity and compassion of our community.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-3xl font-bold">Join Us in Making a Difference</h2>
            <p className="text-lg text-muted-foreground">
              Whether you're raising funds or supporting a cause, we're here to help you create meaningful impact.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button size="lg" onClick={() => window.location.href = "/create-campaign"}>
                Start a Campaign
              </Button>
              <Button size="lg" variant="outline" onClick={() => window.location.href = "/"}>
                Browse Campaigns
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/30">
        <div className="container py-12">
          <div className="text-center text-sm text-muted-foreground">
            <p>© 2024 FundRaise. All rights reserved. Making the world a better place, one donation at a time.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AboutUsPage;
