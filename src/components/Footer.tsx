import Link from "next/link";
import { BookOpen, Mail, Phone, MapPin, Share2, ExternalLink, PlayCircle } from "lucide-react";

const FOOTER_LINKS = {
  "Explore": [
    { label: "Top Engineering Colleges", href: "/colleges?course=engineering" },
    { label: "Top MBA Colleges", href: "/colleges?course=management" },
    { label: "Top Medical Colleges", href: "/colleges?course=medical" },
    { label: "Government Colleges", href: "/colleges?type=government" },
    { label: "Private Colleges", href: "/colleges?type=private" },
  ],
  "Tools": [
    { label: "College Comparison", href: "/compare" },
    { label: "Rank Predictor", href: "/predictor" },
    { label: "Fee Calculator", href: "/tools/fees" },
    { label: "Scholarship Finder", href: "/tools/scholarships" },
  ],
  "Community": [
    { label: "Q&A Discussions", href: "/discussions" },
    { label: "College Reviews", href: "/reviews" },
    { label: "Student Stories", href: "/stories" },
    { label: "Blog", href: "/blog" },
  ],
  "Company": [
    { label: "About Us", href: "/about" },
    { label: "Careers", href: "/careers" },
    { label: "Advertise", href: "/advertise" },
    { label: "Contact Us", href: "/contact" },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t border-gray-100" style={{ background: "var(--navy)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        {/* Top */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "var(--orange)" }}>
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="font-display text-xl font-bold text-white">
                College<span style={{ color: "var(--orange)" }}>Radar</span>
              </span>
            </Link>
            <p className="text-sm text-gray-400 mb-4 leading-relaxed">
              India's most trusted college discovery platform. Find, compare, and choose the right college for your future.
            </p>
            <div className="flex gap-3">
              {[Share2, ExternalLink, PlayCircle].map((Icon, i) => (
                <button key={i} className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-gray-400 hover:bg-orange-500 hover:text-white transition-colors">
                  <Icon className="w-4 h-4" />
                </button>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(FOOTER_LINKS).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-sm font-semibold text-white mb-4">{category}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-sm text-gray-400 hover:text-orange-400 transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact strip */}
        <div className="flex flex-wrap gap-6 py-6 border-t border-white/10 mb-6">
          {[
            { Icon: Mail, text: "support@collegeradar.in" },
            { Icon: Phone, text: "+91 1800-123-4567" },
            { Icon: MapPin, text: "Bengaluru, Karnataka, India" },
          ].map(({ Icon, text }) => (
            <div key={text} className="flex items-center gap-2 text-sm text-gray-400">
              <Icon className="w-4 h-4" style={{ color: "var(--orange)" }} />
              {text}
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-2 pt-6 border-t border-white/10">
          <p className="text-xs text-gray-500">© 2024 CollegeRadar. All rights reserved.</p>
          <div className="flex gap-4">
            {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((t) => (
              <Link key={t} href="#" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">{t}</Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}