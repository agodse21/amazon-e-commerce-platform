export default function Footer() {
  return (
    <footer className="bg-amazon-navy-light mt-8">
      {/* Back to top */}
      <div
        className="bg-amazon-teal hover:bg-[#485769] text-white text-sm text-center py-3 cursor-pointer transition-colors"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        Back to top
      </div>

      {/* Links */}
      <div className="bg-amazon-navy-light text-white py-6 sm:py-8 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            {
              title: 'Get to Know Us',
              links: ['Careers', 'Blog', 'About Amazon', 'Investor Relations'],
            },
            {
              title: 'Make Money with Us',
              links: ['Sell on Amazon', 'Sell under Amazon Accelerator', 'Protect & Build Your Brand'],
            },
            {
              title: 'Amazon Payment Products',
              links: ['Amazon Pay', 'Amazon Pay UPI', 'Amazon.in Reload'],
            },
            {
              title: 'Let Us Help You',
              links: ['COVID-19 and Amazon', 'Your Account', 'Returns Centre', 'Help'],
            },
          ].map((col) => (
            <div key={col.title}>
              <h3 className="font-bold text-sm mb-3">{col.title}</h3>
              <ul className="space-y-1.5">
                {col.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-gray-300 text-xs hover:text-white hover:underline">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="bg-amazon-navy border-t border-gray-700 py-4 px-4 sm:px-8 text-center">
        <p className="text-white font-bold text-xl mb-2">amazon</p>
        <p className="text-gray-400 text-xs">
          © 2026, Amazon.com, Inc. or its affiliates. This is a demo project.
        </p>
      </div>
    </footer>
  );
}
