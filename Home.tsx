import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getLoginUrl } from "@/const";
import { Link } from "wouter";
import { 
  GraduationCap, 
  Microscope, 
  Globe, 
  Users, 
  Award,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Sparkles,
  Star,
  Rocket,
  Brain,
  BookOpen,
  MessageSquare,
  Target,
  Trophy,
  Heart,
  Lightbulb
} from "lucide-react";

const mediaAssets = {
  videos: {
    video1: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663220221996/JghJBuAvvJzPGujK.mp4",
    video2: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663220221996/pLTlCegMcwbMghDp.mp4",
    video3: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663220221996/SfLCIChohRgLfogc.mp4",
    video4: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663220221996/mKSxZMDPuqRcCtFC.mp4",
    video5: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663220221996/ufZlstPROcrKMYQE.mp4",
    video6: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663220221996/bNiKuAfBvnWDcuIV.mp4",
    cambridgeVideo: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663220221996/kjRBlOYOsXJGBffN.mp4"
  },
  images: {
    image1: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663220221996/KDZZPkxwRGLbboJO.jpg",
    image2: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663220221996/zvswVlbFoPiSYvHU.jpg",
    image3: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663220221996/LIVGoLQRvcKjGWsX.jpg",
    image4: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663220221996/IwPrQXmVqRYnlDLg.jpg",
    image5: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663220221996/vDSIcGpPGFgvlMvI.jpg",
    image6: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663220221996/jNvQUOtXNSsCuLUy.jpg",
    image7: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663220221996/NiObTUDTauDgqbED.jpg",
    image8: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663220221996/WEcUMsOzloVaafsR.jpg",
    // New student and activity images
    studentPortrait1: "/images/student-happy-1.jpg",
    studentPortrait2: "/images/student-portrait-1.jpg",
    studentPortrait3: "/images/student-portrait-2.jpg",
    studentPortrait4: "/images/student-portrait-3.jpg",
    farmersMarket: "/images/farmers-market-activity.jpg",
    marketSolo: "/images/market-activity-solo.jpg",
    marketGroup: "/images/market-activity-group.jpg",
    steamActivity: "/images/steam-activity.jpg",
    scienceGroup: "/images/science-experiment-group.jpg",
    foundersPhoto: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663220221996/gZKGLZerdzBagSHN.jpg",
    uniformWhite: "/images/uniform-white.jpg",
    uniformBlue: "/images/uniform-blue.jpg"
  }
};

function useIntersectionObserver() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll(".fade-in-section");
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);
}

function VideoCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const videos = Object.values(mediaAssets.videos).slice(0, 6);

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % videos.length);
  };

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + videos.length) % videos.length);
  };

  return (
    <div className="relative w-full max-w-5xl mx-auto">
      <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl ring-4 ring-primary/20">
        <video
          key={currentIndex}
          src={videos[currentIndex]}
          controls
          className="w-full h-full object-cover"
          autoPlay
          muted
          loop
        />
      </div>
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white hover:bg-primary hover:text-white text-primary rounded-full p-4 shadow-xl transition-all hover:scale-110 active:scale-95"
        aria-label="Previous video"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white hover:bg-primary hover:text-white text-primary rounded-full p-4 shadow-xl transition-all hover:scale-110 active:scale-95"
        aria-label="Next video"
      >
        <ChevronRight className="w-6 h-6" />
      </button>
      <div className="flex justify-center gap-3 mt-8">
        {videos.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-3 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? "bg-primary w-12 shadow-lg"
                : "bg-gray-300 w-3 hover:bg-gray-400 hover:w-6"
            }`}
            aria-label={`Go to video ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

function ImageGallery() {
  const galleryImages = [
    mediaAssets.images.studentPortrait1,
    mediaAssets.images.studentPortrait2,
    mediaAssets.images.studentPortrait3,
    mediaAssets.images.studentPortrait4,
    mediaAssets.images.farmersMarket,
    mediaAssets.images.marketSolo,
    mediaAssets.images.marketGroup,
    mediaAssets.images.steamActivity,
    mediaAssets.images.scienceGroup,
    mediaAssets.images.image1,
    mediaAssets.images.image2,
    mediaAssets.images.image3,
    mediaAssets.images.image4,
    mediaAssets.images.image5,
    mediaAssets.images.image6,
    mediaAssets.images.image7,
    mediaAssets.images.image8,
  ];
  
  return (
    <>
      {/* School Uniforms Showcase */}
      <div className="mb-16">
        <h3 className="text-3xl font-bold text-center mb-8 text-primary">Our School Uniforms</h3>
        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          <Card className="group overflow-hidden border-2 border-primary/20 hover:border-primary hover:shadow-2xl transition-all duration-300">
            <CardContent className="p-0">
              <div className="aspect-[4/5] overflow-hidden">
                <img
                  src={mediaAssets.images.uniformWhite}
                  alt="White school uniform"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="p-4 bg-gradient-to-r from-primary/10 to-secondary/10">
                <p className="text-center font-semibold text-primary">White Uniform</p>
              </div>
            </CardContent>
          </Card>
          <Card className="group overflow-hidden border-2 border-secondary/20 hover:border-secondary hover:shadow-2xl transition-all duration-300">
            <CardContent className="p-0">
              <div className="aspect-[4/5] overflow-hidden">
                <img
                  src={mediaAssets.images.uniformBlue}
                  alt="Blue school uniform"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="p-4 bg-gradient-to-r from-secondary/10 to-accent/10">
                <p className="text-center font-semibold text-secondary">Blue Uniform</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Student Activities Gallery */}
      <div>
        <h3 className="text-3xl font-bold text-center mb-8 text-secondary">Student Life & Activities</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {galleryImages.map((src, index) => (
            <div
              key={index}
              className="group relative aspect-square rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-rotate-1"
            >
              <img
                src={src}
                alt={`School activity ${index + 1}`}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  useIntersectionObserver();

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Floating decorative elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <img src="/decorations/stars.png" alt="" className="absolute top-20 right-10 w-32 h-32 opacity-30 animate-pulse-slow" />
        <img src="/decorations/shapes.png" alt="" className="absolute bottom-40 left-10 w-40 h-40 opacity-20 animate-pulse-slow" style={{ animationDelay: "1s" }} />
        <img src="/decorations/science.png" alt="" className="absolute top-1/2 right-20 w-36 h-36 opacity-25 animate-pulse-slow" style={{ animationDelay: "2s" }} />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/98 backdrop-blur-md shadow-lg border-b-4 border-primary/20">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-24">
            <div className="flex items-center gap-4">
              <div className="relative">
                <img src="/logo.png" alt="My Duc School" className="h-20 w-20 object-contain drop-shadow-lg" />
                <Sparkles className="absolute -top-1 -right-1 w-5 h-5 text-accent animate-pulse" />
              </div>
              <div>
                <span className="text-2xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent" style={{color: '#10214d'}}>
                  My Duc School
                </span>
                <p className="text-xs text-muted-foreground font-medium">The School of Science</p>
              </div>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#about" className="text-foreground hover:text-primary transition-colors font-semibold text-lg relative group">
                About
                <span className="absolute -bottom-1 left-0 w-0 h-1 bg-primary rounded-full transition-all group-hover:w-full"></span>
              </a>
              <a href="#programs" className="text-foreground hover:text-secondary transition-colors font-semibold text-lg relative group">
                Programs
                <span className="absolute -bottom-1 left-0 w-0 h-1 bg-secondary rounded-full transition-all group-hover:w-full"></span>
              </a>
              <a href="#science" className="text-foreground hover:text-accent transition-colors font-semibold text-lg relative group">
                Science
                <span className="absolute -bottom-1 left-0 w-0 h-1 bg-accent rounded-full transition-all group-hover:w-full"></span>
              </a>
              <a href="#gallery" className="text-foreground hover:text-primary transition-colors font-semibold text-lg relative group">
                Gallery
                <span className="absolute -bottom-1 left-0 w-0 h-1 bg-primary rounded-full transition-all group-hover:w-full"></span>
              </a>
              <a href="/dashboard" className="text-foreground hover:text-secondary transition-colors font-semibold text-lg relative group">
                Student Portal
                <span className="absolute -bottom-1 left-0 w-0 h-1 bg-secondary rounded-full transition-all group-hover:w-full"></span>
              </a>
              {isAuthenticated ? (
                <Link href="/dashboard">
                  <Button size="lg" className="shadow-lg hover:shadow-xl transition-all hover:scale-105">
                    <Users className="w-4 h-4 mr-2" />
                    Dashboard
                  </Button>
                </Link>
              ) : (
                <Link href="/login">
                  <Button size="lg" className="shadow-lg hover:shadow-xl transition-all hover:scale-105 bg-gradient-to-r from-primary to-secondary">
                    <Users className="w-4 h-4 mr-2" />
                    Parent Login
                  </Button>
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-foreground bg-primary/10 p-2 rounded-xl hover:bg-primary/20 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-6 border-t border-primary/20 bg-gradient-to-b from-white to-primary/5">
              <div className="flex flex-col gap-4">
                <a href="#about" className="text-foreground hover:text-primary transition-colors font-semibold text-lg px-4 py-2 rounded-lg hover:bg-primary/10" onClick={() => setMobileMenuOpen(false)}>About</a>
                <a href="#programs" className="text-foreground hover:text-secondary transition-colors font-semibold text-lg px-4 py-2 rounded-lg hover:bg-secondary/10" onClick={() => setMobileMenuOpen(false)}>Programs</a>
                <a href="#science" className="text-foreground hover:text-accent transition-colors font-semibold text-lg px-4 py-2 rounded-lg hover:bg-accent/10" onClick={() => setMobileMenuOpen(false)}>Science</a>
                <a href="#gallery" className="text-foreground hover:text-primary transition-colors font-semibold text-lg px-4 py-2 rounded-lg hover:bg-primary/10" onClick={() => setMobileMenuOpen(false)}>Gallery</a>
                {isAuthenticated ? (
                  <Link href="/dashboard">
                    <Button className="w-full" size="lg">Dashboard</Button>
                  </Link>
                ) : (
                  <Link href="/login" className="w-full">
                    <Button className="w-full" size="lg">
                      Parent Login
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24">
        {/* Light Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-50 via-purple-50 to-pink-50"></div>
        
        {/* Decorative Shapes - Left Side */}
        <div className="absolute left-10 top-1/2 -translate-y-1/2 space-y-4 opacity-40">
          <div className="w-16 h-16 rounded-full bg-cyan-400"></div>
          <div className="w-12 h-12 bg-purple-400" style={{clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)'}}></div>
          <div className="w-10 h-10 rounded-full bg-yellow-400"></div>
          <div className="w-14 h-14 bg-pink-400" style={{clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)'}}></div>
          <div className="w-12 h-12 bg-blue-300"></div>
          <div className="w-16 h-16 rounded-full bg-cyan-300"></div>
        </div>
        
        {/* Decorative Shapes - Right Side */}
        <div className="absolute right-10 top-1/3 space-y-4 opacity-40">
          <div className="w-12 h-12 bg-pink-400 rounded-lg"></div>
          <div className="w-16 h-16 bg-purple-300 rounded-full"></div>
          <div className="w-10 h-10 bg-yellow-400" style={{clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)'}}></div>
          <div className="w-14 h-14 bg-cyan-400 rounded-lg"></div>
        </div>
        
        {/* Science Illustrations - Right Bottom */}
        <div className="absolute right-20 bottom-1/4 opacity-30">
          <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
            <circle cx="40" cy="40" r="8" fill="#ec4899" />
            <circle cx="70" cy="50" r="6" fill="#8b5cf6" />
            <circle cx="50" cy="70" r="10" fill="#06b6d4" />
            <path d="M30 80 L30 100 L70 100 L70 80 Q70 60 50 60 Q30 60 30 80" stroke="#8b5cf6" strokeWidth="2" fill="none"/>
            <rect x="45" y="55" width="10" height="10" fill="#06b6d4" opacity="0.5"/>
          </svg>
        </div>
        
        <div className="container relative z-10 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
            {/* Left side - Text Content */}
            <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg mb-8 fade-in-section">
              <Sparkles className="w-5 h-5 text-accent animate-pulse" />
              <span className="text-sm font-semibold text-primary">Welcome to Excellence in Education</span>
              <Sparkles className="w-5 h-5 text-secondary animate-pulse" />
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-4 leading-tight fade-in-section text-center lg:text-left" style={{ animationDelay: "0.1s" }}>
              <span className="bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 bg-clip-text text-transparent" style={{color: '#1a2651'}}>
                <div>My Duc School</div>
                <div className="text-3xl md:text-5xl">The School of Science</div>
              </span>
            </h1>
            <p className="text-2xl md:text-3xl font-bold text-yellow-500 mb-6 fade-in-section text-center lg:text-left" style={{ animationDelay: "0.2s" }}>
              Where Dreams Come True
            </p>
            

            
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start fade-in-section mb-8" style={{ animationDelay: "0.3s" }}>
              <Button size="lg" className="text-xl px-10 py-8 shadow-lg hover:shadow-xl transition-all hover:scale-105 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white">
                <a href="#programs" className="flex items-center gap-2">
                  <Rocket className="w-6 h-6" />
                  Explore Programs
                </a>
              </Button>
              <Button size="lg" variant="outline" className="text-xl px-10 py-8 shadow-lg hover:shadow-xl transition-all hover:scale-105 border-2 border-cyan-500 text-gray-800 hover:bg-cyan-500 hover:text-white">
                <a href="#contact" className="flex items-center gap-2">
                  <Heart className="w-6 h-6" />
                  Contact Us
                </a>
              </Button>
            </div>

            </div>
            
            {/* Right side - Science Lab Photo */}
            <div className="relative fade-in-section" style={{ animationDelay: "0.6s" }}>
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-8 border-white/80">
                <img 
                  src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663220221996/crHZYLWWdtBaLtzk.png" 
                  alt="Students in lab coats conducting science experiments" 
                  className="w-full h-auto"
                />
              </div>
              {/* Decorative elements around photo */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-yellow-400 rounded-full opacity-60 animate-pulse-slow"></div>
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-pink-400 rounded-full opacity-60 animate-pulse-slow" style={{ animationDelay: "1s" }}></div>
            </div>
          </div>
          
          {/* Stats Cards Below */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 max-w-4xl mx-auto fade-in-section" style={{ animationDelay: "0.7s" }}>
            <Card className="bg-white border-none shadow-lg hover:shadow-xl transition-all hover:scale-105">
              <CardContent className="p-6 text-center">
                <Trophy className="w-10 h-10 mx-auto mb-3 text-yellow-500" />
                <div className="text-3xl font-bold text-cyan-500">15:1</div>
                <div className="text-sm text-gray-600 font-medium">Student-Teacher Ratio</div>
              </CardContent>
            </Card>
            <Card className="bg-white border-none shadow-lg hover:shadow-xl transition-all hover:scale-105">
              <CardContent className="p-6 text-center">
                <Star className="w-10 h-10 mx-auto mb-3 text-yellow-500" />
                <div className="text-3xl font-bold text-purple-500">20+</div>
                <div className="text-sm text-gray-600 font-medium">Years Experience</div>
              </CardContent>
            </Card>
            <Card className="bg-white border-none shadow-lg hover:shadow-xl transition-all hover:scale-105">
              <CardContent className="p-6 text-center">
                <Users className="w-10 h-10 mx-auto mb-3 text-yellow-500" />
                <div className="text-3xl font-bold text-orange-500">100%</div>
                <div className="text-sm text-gray-600 font-medium">Certified Native Teachers</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-8 h-12 border-2 border-primary rounded-full flex items-start justify-center p-2">
            <div className="w-2 h-3 bg-primary rounded-full animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Video Showcase */}
      <section className="py-24 bg-gradient-to-b from-white to-primary/5 relative">
        <div className="container relative z-10">
          <div className="text-center mb-16 fade-in-section">
            <div className="inline-flex items-center gap-2 bg-primary/10 px-6 py-2 rounded-full mb-4">
              <Sparkles className="w-5 h-5 text-primary" />
              <span className="text-sm font-semibold text-primary">See Us In Action</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Experience Our School
            </h2>
            <p className="text-2xl text-muted-foreground max-w-2xl mx-auto">
              Watch our students discover, learn, and grow every day
            </p>
          </div>
          <div className="fade-in-section">
            <VideoCarousel />
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 bg-gradient-to-br from-secondary/10 via-primary/10 to-accent/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl"></div>
        
        <div className="container relative z-10">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16 fade-in-section">
              <div className="inline-flex items-center gap-2 bg-white px-6 py-2 rounded-full mb-4 shadow-lg">
                <Brain className="w-5 h-5 text-primary" />
                <span className="text-sm font-semibold text-primary">Our Story</span>
              </div>
              <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">
                About My Duc School
              </h2>
              <p className="text-2xl md:text-3xl text-gray-800 mb-4 font-medium">
                Nurturing Future <span className="text-cyan-500 font-bold">Nobel Prize Winners</span>
              </p>
              <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto">
                Through Cambridge English & Science Excellence
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              {/* Founders Photo */}
              <Card className="fade-in-section md:col-span-3 bg-white/95 backdrop-blur-sm border-2 border-primary/20 hover:border-primary hover:shadow-2xl transition-all duration-300">
                <CardContent className="p-0">
                  <div className="aspect-[3/2] overflow-hidden rounded-t-xl">
                    <img 
                      src={mediaAssets.images.foundersPhoto} 
                      alt="Founders Mr. Tu and Mr. Dan" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-8">
                    <h3 className="text-3xl font-bold mb-4 text-center bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                      Meet Our Founders
                    </h3>
                    <div className="grid md:grid-cols-2 gap-6 text-center">
                      <div>
                        <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                          <Microscope className="w-8 h-8 text-white" />
                        </div>
                        <h4 className="text-xl font-bold mb-2 text-primary">Ms. My & Mr. Tu</h4>
                        <p className="text-foreground/80 leading-relaxed">
                          Remarkable scientists with a passion for nurturing young minds and creating future innovators
                        </p>
                      </div>
                      <div>
                        <div className="w-16 h-16 bg-gradient-to-br from-secondary to-accent rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                          <Globe className="w-8 h-8 text-white" />
                        </div>
                        <h4 className="text-xl font-bold mb-2 text-secondary">Mr. Dan</h4>
                        <p className="text-foreground/80 leading-relaxed">
                          British educator with 20 years experience, AI expertise, and deep Vietnamese cultural understanding
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

            </div>

            <Card className="fade-in-section bg-gradient-to-br from-white via-primary/5 to-accent/5 border-2 border-primary/30 shadow-2xl hover:shadow-3xl transition-all duration-300">
              <CardContent className="p-10">
                <div className="text-center mb-8">
                  <div className="w-20 h-20 bg-gradient-to-br from-accent to-primary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <Lightbulb className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold mb-4 text-accent">Our Mission</h3>
                  <p className="text-lg text-foreground/80 leading-relaxed mb-2">
                    Nurturing unique minds through the fusion of Science, Technology, English, and Life Skills
                  </p>
                </div>
                <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent my-8"></div>
                <p className="text-xl leading-relaxed text-foreground/90 text-center mb-6">
                  We believe every child is unique. While other schools want to make students the same, think the same, all to control behavior, we do not. We dedicate our time to <strong className="text-primary">nurture the individuality</strong> that they aim to suppress. We help each student discover what makes them different. We teach with <strong className="text-secondary">physical books</strong>, not screens. We embrace <strong className="text-accent">AI as essential for the future</strong>, yet it is balanced with traditional ways. It is our belief that learning critical thinking integrated with scientific discoveries through fun scientific experiments forms the foundation to success. By embracing this at an early age, children will develop into young adults with a <strong className="text-primary">stronger self-belief</strong>, holding <strong className="text-secondary">honest values</strong>, and equipped with the essential tools needed to fulfil their dreams.
                </p>
                <p className="text-xl leading-relaxed text-foreground/90 text-center mb-6">
                  We don't see students as the same. Everyone is taught to <strong className="text-primary">follow their passion</strong> and achieve greatness, no matter what. There is nothing that can't be achieved if you put your mind to it. We nurture unique qualities that blossom and prepare students to be the <strong className="text-secondary">future leaders of tomorrow</strong>.
                </p>
                <div className="flex justify-center gap-4 flex-wrap">
                  <span className="px-4 py-2 bg-primary/10 text-primary rounded-full font-semibold">Individuality</span>
                  <span className="px-4 py-2 bg-secondary/10 text-secondary rounded-full font-semibold">Cultural Intelligence</span>
                  <span className="px-4 py-2 bg-accent/10 text-accent rounded-full font-semibold">Balanced Learning</span>
                  <span className="px-4 py-2 bg-primary/10 text-primary rounded-full font-semibold">Global Confidence</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Cambridge Programs Section */}
      <section id="programs" className="py-24 bg-white relative overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-secondary/5 rounded-full blur-3xl"></div>
        
        <div className="container relative z-10">
          <div className="text-center mb-20 fade-in-section">
            <div className="inline-flex items-center gap-2 bg-primary/10 px-6 py-2 rounded-full mb-4">
              <Award className="w-5 h-5 text-primary" />
              <span className="text-sm font-semibold text-primary">World-Class Education</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Cambridge English Programs
            </h2>
            <p className="text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              We don't just teach Cambridge—we prepare your child to thrive in any culture, anywhere in the world. Our curriculum goes beyond language to build confidence, cultural understanding, and the skills needed to succeed globally.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            <Card className="fade-in-section group bg-gradient-to-br from-white to-primary/5 border-2 border-primary/20 hover:border-primary hover:shadow-2xl transition-all duration-500 hover:-translate-y-3">
              <CardContent className="p-8">
                <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary/60 rounded-3xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <GraduationCap className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-primary">Pre A1 Starters</h3>
                <p className="text-sm text-muted-foreground mb-4 font-semibold">Ages 6-12 | Pre-level A1</p>
                <p className="text-foreground/80 leading-relaxed">
                  Building foundations for global communication. Through physical books and hands-on activities, young learners discover how language opens doors to understanding different cultures and perspectives.
                </p>
              </CardContent>
            </Card>

            <Card className="fade-in-section group bg-gradient-to-br from-white to-secondary/5 border-2 border-secondary/20 hover:border-secondary hover:shadow-2xl transition-all duration-500 hover:-translate-y-3" style={{ animationDelay: "0.1s" }}>
              <CardContent className="p-8">
                <div className="w-20 h-20 bg-gradient-to-br from-secondary to-secondary/60 rounded-3xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Globe className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-secondary">A1 Movers</h3>
                <p className="text-sm text-muted-foreground mb-4 font-semibold">Ages 6-12 | CEFR Level A1</p>
                <p className="text-foreground/80 leading-relaxed">
                  Expanding horizons through storytelling and dialogue. Students learn to express their unique ideas while developing the confidence to connect with people from diverse backgrounds.
                </p>
              </CardContent>
            </Card>

            <Card className="fade-in-section group bg-gradient-to-br from-white to-accent/5 border-2 border-accent/20 hover:border-accent hover:shadow-2xl transition-all duration-500 hover:-translate-y-3" style={{ animationDelay: "0.2s" }}>
              <CardContent className="p-8">
                <div className="w-20 h-20 bg-gradient-to-br from-accent to-accent/60 rounded-3xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Award className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-accent">A2 Flyers</h3>
                <p className="text-sm text-muted-foreground mb-4 font-semibold">Ages 6-12 | CEFR Level A2</p>
                <p className="text-foreground/80 leading-relaxed">
                  Mastering communication for a connected world. Advanced learners develop the language skills and cultural awareness needed to integrate confidently into international communities and excel in global settings.
                </p>
              </CardContent>
            </Card>

            <Card className="fade-in-section group bg-gradient-to-br from-white to-primary/5 border-2 border-primary/20 hover:border-primary hover:shadow-2xl transition-all duration-500 hover:-translate-y-3" style={{ animationDelay: "0.3s" }}>
              <CardContent className="p-8">
                <div className="w-20 h-20 bg-gradient-to-br from-primary via-secondary to-accent rounded-3xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Trophy className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-3 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">IELTS</h3>
                <p className="text-sm text-muted-foreground mb-4 font-semibold">For Older Teens</p>
                <p className="text-foreground/80 leading-relaxed">
                  Preparing future leaders for studying abroad. Our IELTS program combines rigorous academic English with cultural intelligence, ensuring students don't just survive in foreign universities—they thrive and lead.
                </p>
                <ul className="space-y-3 text-sm text-foreground/70" style={{display: 'none'}}>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    Band score 1-9
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    Four skills tested
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    Globally recognized
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    University preparation
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="max-w-4xl mx-auto fade-in-section">
            <div className="aspect-video rounded-3xl overflow-hidden shadow-2xl ring-4 ring-primary/20">
              <video
                src={mediaAssets.videos.cambridgeVideo}
                controls
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Science Program Section */}
      <section id="science" className="py-24 bg-gradient-to-br from-accent/10 via-secondary/10 to-primary/10 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-5">
          <img src="/decorations/science.png" alt="" className="absolute top-20 left-20 w-64 h-64" />
          <img src="/decorations/science.png" alt="" className="absolute bottom-20 right-20 w-64 h-64" />
        </div>
        
        <div className="container relative z-10">
          <div className="text-center mb-20 fade-in-section">
            <div className="inline-flex items-center gap-2 bg-white px-6 py-2 rounded-full mb-4 shadow-lg">
              <Microscope className="w-5 h-5 text-secondary" />
              <span className="text-sm font-semibold text-secondary">Hands-On Learning</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-secondary via-accent to-primary bg-clip-text text-transparent">
              Science Program
            </h2>
            <p className="text-2xl text-muted-foreground max-w-3xl mx-auto">
              Teaching critical thinking, prediction, and presentation skills
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10 mb-16">
            <Card className="fade-in-section group bg-white border-2 border-primary/20 hover:border-primary hover:shadow-2xl transition-all duration-500 hover:-translate-y-3">
              <CardContent className="p-10 text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-primary to-primary/60 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                  <Brain className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-3xl font-bold mb-6 text-primary">Critical Thinking</h3>
                <p className="text-lg text-foreground/80 leading-relaxed">
                  Children learn to analyze problems, ask questions, and develop scientific reasoning skills through hands-on experiments.
                </p>
              </CardContent>
            </Card>

            <Card className="fade-in-section group bg-white border-2 border-secondary/20 hover:border-secondary hover:shadow-2xl transition-all duration-500 hover:-translate-y-3" style={{ animationDelay: "0.1s" }}>
              <CardContent className="p-10 text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-secondary to-secondary/60 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                  <Target className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-3xl font-bold mb-6 text-secondary">Predict & Collect Data</h3>
                <p className="text-lg text-foreground/80 leading-relaxed">
                  Students make predictions, conduct experiments, and collect data, learning the scientific method in an engaging way.
                </p>
              </CardContent>
            </Card>

            <Card className="fade-in-section group bg-white border-2 border-accent/20 hover:border-accent hover:shadow-2xl transition-all duration-500 hover:-translate-y-3" style={{ animationDelay: "0.2s" }}>
              <CardContent className="p-10 text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-accent to-accent/60 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                  <MessageSquare className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-3xl font-bold mb-6 text-accent">Presentation Skills</h3>
                <p className="text-lg text-foreground/80 leading-relaxed">
                  Daily presentations and peer-to-peer reviewing help children become confident leaders and effective communicators.
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="max-w-5xl mx-auto fade-in-section bg-gradient-to-br from-white to-secondary/5 border-2 border-secondary/30 shadow-2xl">
            <CardContent className="p-12">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-gradient-to-br from-secondary to-accent rounded-2xl flex items-center justify-center shadow-lg">
                    <Heart className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div>
                  <p className="text-xl leading-relaxed text-foreground/90 mb-6">
                    We foster a student's individuality and help children develop healthy interests in whatever they dream of becoming in the future. With our collaboration and unified vision for elite education that promotes <strong className="text-primary">healthy core values</strong>, <strong className="text-secondary">discussions</strong>, <strong className="text-accent">innovation</strong>, cultural awareness, and confidence in one's ability, we have developed an ecosystem that is forever growing and reshaping to align with an ever-changing future.
                  </p>
                  <div className="flex gap-3 flex-wrap">
                    <span className="px-4 py-2 bg-primary text-white rounded-full font-semibold shadow-md">Innovation</span>
                    <span className="px-4 py-2 bg-secondary text-white rounded-full font-semibold shadow-md">Confidence</span>
                    <span className="px-4 py-2 bg-accent text-white rounded-full font-semibold shadow-md">Individuality</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="py-24 bg-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <img src="/decorations/stars.png" alt="" className="absolute top-10 left-10 w-48 h-48" />
          <img src="/decorations/shapes.png" alt="" className="absolute bottom-10 right-10 w-48 h-48" />
        </div>
        
        <div className="container relative z-10">
          <div className="text-center mb-20 fade-in-section">
            <div className="inline-flex items-center gap-2 bg-primary/10 px-6 py-2 rounded-full mb-4">
              <Sparkles className="w-5 h-5 text-primary" />
              <span className="text-sm font-semibold text-primary">Memories</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Our Gallery
            </h2>
            <p className="text-2xl text-muted-foreground">Moments from our vibrant learning environment</p>
          </div>
          <div className="fade-in-section">
            <ImageGallery />
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="py-24 bg-gradient-to-r from-primary via-secondary to-accent relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('/decorations/stars.png')] bg-repeat"></div>
        </div>
        
        <div className="container relative z-10">
          <div className="max-w-5xl mx-auto text-center text-white fade-in-section">
            <div className="mb-8">
              <Star className="w-16 h-16 mx-auto mb-4 animate-pulse" />
            </div>
            <blockquote className="text-3xl md:text-5xl font-bold mb-8 leading-tight">
              "We need diversity of thought in the world to face the new challenges"
            </blockquote>
            <div className="w-24 h-1 bg-white/50 mx-auto mb-8"></div>
            <p className="text-xl md:text-2xl font-semibold mb-4">
              — Tim Berners-Lee
            </p>
            <p className="text-lg opacity-90 mb-6">
              London, England
            </p>
            <p className="text-base opacity-80 max-w-3xl mx-auto leading-relaxed">
              Inventor of the World Wide Web. After creating the internet we all use today, he gave it away for free. He knew it would only work if it worked for everyone.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 bg-gradient-to-b from-white to-primary/5 relative overflow-hidden">
        <div className="absolute top-20 right-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-64 h-64 bg-secondary/10 rounded-full blur-3xl"></div>
        
        <div className="container relative z-10">
          <div className="max-w-5xl mx-auto text-center fade-in-section">
            <div className="inline-flex items-center gap-2 bg-primary/10 px-6 py-2 rounded-full mb-6">
              <Heart className="w-5 h-5 text-primary" />
              <span className="text-sm font-semibold text-primary">Join Our Family</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-bold mb-8 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Get In Touch
            </h2>
            <p className="text-2xl text-muted-foreground mb-16">
              Ready to give your child the best start in their educational journey?
            </p>
            
            <div className="grid md:grid-cols-2 gap-8 text-left">
              <Card className="group bg-gradient-to-br from-white to-primary/5 border-2 border-primary/20 hover:border-primary hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                <CardContent className="p-10">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
                    <Microscope className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold mb-4 text-primary">Visit Us</h3>
                  <p className="text-lg text-foreground/80 mb-8 leading-relaxed">
                    Come see our state-of-the-art facilities and meet our passionate educators.
                  </p>
                  <Button size="lg" className="w-full text-lg py-6 shadow-lg hover:shadow-xl transition-all hover:scale-105">
                    Schedule a Visit
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="group bg-gradient-to-br from-white to-secondary/5 border-2 border-secondary/20 hover:border-secondary hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                <CardContent className="p-10">
                  <div className="w-16 h-16 bg-gradient-to-br from-secondary to-accent rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
                    <Rocket className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold mb-4 text-secondary">Enroll Now</h3>
                  <p className="text-lg text-foreground/80 mb-8 leading-relaxed">
                    Join our community of future innovators and leaders.
                  </p>
                  <Button size="lg" variant="outline" className="w-full text-lg py-6 border-2 border-secondary hover:bg-secondary hover:text-white shadow-lg hover:shadow-xl transition-all hover:scale-105">
                    Start Application
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-foreground to-foreground/90 text-background py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('/decorations/shapes.png')] bg-repeat"></div>
        </div>
        
        <div className="container relative z-10">
          <div className="grid md:grid-cols-3 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-4 mb-6">
                <img src="/logo.png" alt="My Duc School" className="h-16 w-16 object-contain drop-shadow-lg" />
                <div>
                  <span className="text-xl font-bold">My Duc School</span>
                  <p className="text-xs opacity-80">of Science</p>
                </div>
              </div>
              <p className="text-background/80 leading-relaxed">
                Nurturing future Nobel Prize winners through excellence in science and English education.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold text-lg mb-6 flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Quick Links
              </h4>
              <ul className="space-y-3 text-background/80">
                <li><a href="#about" className="hover:text-background transition-colors hover:translate-x-1 inline-block">About</a></li>
                <li><a href="#programs" className="hover:text-background transition-colors hover:translate-x-1 inline-block">Programs</a></li>
                <li><a href="#science" className="hover:text-background transition-colors hover:translate-x-1 inline-block">Science</a></li>
                <li><a href="#gallery" className="hover:text-background transition-colors hover:translate-x-1 inline-block">Gallery</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-lg mb-6 flex items-center gap-2">
                <Users className="w-5 h-5" />
                For Parents
              </h4>
              <ul className="space-y-3 text-background/80">
                <li>
                  {isAuthenticated ? (
                    <Link href="/dashboard" className="hover:text-background transition-colors hover:translate-x-1 inline-block">Dashboard</Link>
                  ) : (
                    <Link href="/login" className="hover:text-background transition-colors hover:translate-x-1 inline-block">Parent Login</Link>
                  )}
                </li>
                <li><a href="#contact" className="hover:text-background transition-colors hover:translate-x-1 inline-block">Contact Us</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-background/20 pt-8 text-center text-background/60">
            <p className="flex items-center justify-center gap-2">
              <Heart className="w-4 h-4 text-red-400 animate-pulse" />
              &copy; {new Date().getFullYear()} My Duc School of Science. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
