import { Link, useNavigate } from "react-router-dom";
import { Heart, Menu, User, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import CampaignCard from "@/components/CampaignCard";
import heroImage from "@/assets/hero-fundraising.jpg";
import emergencyCrisisImage from "@/assets/emergency-crisis.jpg";
import { useEffect, useState } from "react";
import { useRef } from "react";



import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

const HomePage = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setisLoggenIn] = useState(false);
  const emergencyRef = useRef<HTMLDivElement>(null);
  const campaignsRef = useRef<HTMLDivElement>(null);
  const [campaigns, setCampaigns] = useState([]);
  const emergencyCampaigns = campaigns.filter(c => c.emergency === true);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


  //Using API TO actually get the id
  const [id, setId] = useState();
  useEffect(() => {
    const check = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/org/auth`, {
          method: "GET",
          credentials: "include"
        });
        const data = await res.json();
        console.log(data.authenticated)
        setisLoggenIn(data.authenticated);

        // // get signup step from localStorage
        // const step = localStorage.getItem("signupStep");
        // setSignupStep(step);
      } catch (err) {
        console.error("Auth check failed:", err);
        setisLoggenIn(false);
      }
    };
    check();
  }, []);
  useEffect(() => {
    const fetchOrgId = async () => {
      try {
        if (!isLoggedIn) return;
        const res = await fetch(`${API_BASE_URL}/api/org/getId`, {
          method: "POST",
          credentials: "include",
        });
        const data = await res.json();

        if (res.ok && data.success) {
          setId(data.orgId.toString());
        } else {
          console.error("Failed to fetch org ID:", data.message);
        }
      } catch (err) {
        console.error("Error fetching org ID:", err);
      }
    };

    fetchOrgId();
  }, []);


  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/campaigns/active`);
        const data = await res.json();
        console.log(data)
        const transformed = data.map((campaign: any) => ({
          id: campaign.id.toString(),
          name: campaign.name,
          description: campaign.description,
          banner: campaign.banner,
          targetAmount: parseFloat(campaign.target_amount),
          raised: parseFloat(campaign.collected_amount),
          status: campaign.status,
          emergency: campaign.emergency,
        }));

        setCampaigns(transformed);
      } catch (err) {
        console.error("Failed to fetch campaigns:", err);
      }
    };

    fetchCampaigns();
  }, []);



  const NavLinks = () => (
    <>
      <Link to="/careers" className="text-foreground/80 hover:text-foreground transition-colors">
        Careers
      </Link>
      <Link to="/about" className="text-foreground/80 hover:text-foreground transition-colors">
        About Us
      </Link>
      {isLoggedIn ? (
        <Button variant="ghost" size="icon" onClick={() => navigate(`/account/${id}`)}>
          <User className="h-5 w-5" />
        </Button>
      ) : (
        <Button onClick={() => navigate("/signin")}>
          Sign In
        </Button>
      )}
    </>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl">
            <Heart className="h-6 w-6 text-primary fill-primary" />
            <span className="bg-gradient-primary bg-clip-text text-transparent">FundRaise</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <NavLinks />
          </div>

          {/* Mobile Navigation */}
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <div className="flex flex-col gap-6 mt-8">
                <NavLinks />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent z-10" />
        <div className="container relative z-20 py-24 md:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 animate-in fade-in slide-in-from-left duration-700">
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                Make a Difference
                <span className="block bg-gradient-primary bg-clip-text text-transparent">
                  One Donation at a Time
                </span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-xl">
                Join thousands of changemakers who are transforming lives through compassion and generosity. Every contribution creates a ripple of positive impact.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button
                  size="lg"
                  className="group"
                  onClick={() => emergencyRef.current?.scrollIntoView({ behavior: "smooth" })}
                >
                  Raise Fund
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => campaignsRef.current?.scrollIntoView({ behavior: "smooth" })}
                >
                  Browse Campaigns
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 pt-8">
                <div className="space-y-1">
                  <p className="text-3xl font-bold text-primary">10K+</p>
                  <p className="text-sm text-muted-foreground">Donors</p>
                </div>
                <div className="space-y-1">
                  <p className="text-3xl font-bold text-primary">$5M+</p>
                  <p className="text-sm text-muted-foreground">Raised</p>
                </div>
                <div className="space-y-1">
                  <p className="text-3xl font-bold text-primary">500+</p>
                  <p className="text-sm text-muted-foreground">Campaigns</p>
                </div>
              </div>
            </div>

            <div className="relative animate-in fade-in slide-in-from-right duration-700 delay-200">
              <div className="absolute inset-0 bg-gradient-primary opacity-20 blur-3xl rounded-full" />
              <img
                src={heroImage}
                alt="People helping each other"
                className="relative rounded-2xl shadow-2xl w-full h-auto hover:scale-[1.02] transition-transform duration-500"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Emergency Campaign */}

      {/* Featured Emergency Campaigns */}
      <section ref={emergencyRef} className="py-16 bg-muted/30">
        <div className="container">
          <div className="text-center mb-8 space-y-2">
            <h2 className="text-3xl font-bold">Emergency Crisis</h2>
            <p className="text-muted-foreground">Urgent help needed - Every second counts</p>
          </div>

          <div
            onClick={() => {
              const emergencyId = emergencyCampaigns[0]?.id;
              if (emergencyId) {
                window.location.href = `http://localhost:8080/donation-form-preview/${emergencyId}`;
              }
            }}
            className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden cursor-pointer group shadow-medium hover:shadow-2xl transition-all duration-500"
          >
            <img
              src={emergencyCrisisImage}
              alt="Emergency Crisis Relief"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12">
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom duration-500">
                <div className="inline-block px-3 py-1 rounded-full bg-destructive text-destructive-foreground text-sm font-medium">
                  URGENT
                </div>
                <h3 className="text-3xl md:text-5xl font-bold text-white">
                  {emergencyCampaigns[0]?.name}
                </h3>
                <p className="text-white/90 text-lg max-w-2xl">
                  {emergencyCampaigns[0]?.description}
                </p>
                <div className="flex items-center gap-6 text-white">
                  <div>
                    <p className="text-2xl font-bold">${emergencyCampaigns[0]?.Raised}</p>
                    <p className="text-sm text-white/80">of ${emergencyCampaigns[0]?.targetAmount} goal</p>
                  </div>
                  <div className="h-2 flex-1 bg-white/20 rounded-full overflow-hidden max-w-md">
                    <div className="h-full bg-primary w-1/2 rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Active Campaigns */}
      <section ref={campaignsRef} className="py-16">
        <div className="container">
          <div className="text-center mb-12 space-y-2">
            <h2 className="text-3xl font-bold">Active Campaigns</h2>
            <p className="text-muted-foreground">Support causes that matter to you</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {campaigns.map((campaign, index) => (
              <div
                key={campaign.id}
                className="animate-in fade-in slide-in-from-bottom duration-500"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CampaignCard {...campaign} />
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/30">
        <div className="container py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <Link to="/" className="flex items-center gap-2 font-bold text-xl">
                <Heart className="h-6 w-6 text-primary fill-primary" />
                <span className="bg-gradient-primary bg-clip-text text-transparent">FundRaise</span>
              </Link>
              <p className="text-sm text-muted-foreground">
                Empowering communities through compassionate giving and transparent fundraising.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Platform</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/campaigns" className="hover:text-foreground transition-colors">Browse Campaigns</Link></li>
                <li><Link to="/create-campaign" className="hover:text-foreground transition-colors">Start Campaign</Link></li>
                <li><Link to="/about" className="hover:text-foreground transition-colors">How It Works</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/about" className="hover:text-foreground transition-colors">About Us</Link></li>
                <li><Link to="/careers" className="hover:text-foreground transition-colors">Careers</Link></li>
                <li><Link to="/team" className="hover:text-foreground transition-colors">Team</Link></li>
                <li><Link to="/contact" className="hover:text-foreground transition-colors">Contact</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link></li>
                <li><Link to="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link></li>
                <li><Link to="/cookies" className="hover:text-foreground transition-colors">Cookie Policy</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>© 2024 FundRaise. All rights reserved. Making the world a better place, one donation at a time.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;