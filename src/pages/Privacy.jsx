import React from 'react';
import '../styles/legal.css';

function Privacy() {
  return (
    <div className="legal-page">
      <div className="legal-container">
        <h1>Privacy Policy</h1>
        <p className="last-updated">Last Updated: April 24, 2025</p>
        
        <section className="legal-section">
          <h2>1. Introduction</h2>
          <p>
            Welcome to LearnAI. We respect your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our application.
          </p>
          <p>
            Please read this Privacy Policy carefully. If you do not agree with the terms of this Privacy Policy, please do not access the application.
          </p>
        </section>
        
        <section className="legal-section">
          <h2>2. Information We Collect</h2>
          <h3>Personal Data</h3>
          <p>
            When you register for an account, we may collect the following information:
          </p>
          <ul>
            <li>Name</li>
            <li>Email address</li>
            <li>Academic information (optional)</li>
            <li>Profile information (optional)</li>
          </ul>
          
          <h3>Usage Data</h3>
          <p>
            We automatically collect certain information when you access or use our application, such as:
          </p>
          <ul>
            <li>Device information (type of device, operating system)</li>
            <li>Log data (pages visited, time spent on pages)</li>
            <li>Task and calendar data you create within the application</li>
            <li>Your interaction patterns with the application features</li>
          </ul>
        </section>
        
        <section className="legal-section">
          <h2>3. How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul>
            <li>Provide, maintain, and improve our services</li>
            <li>Create and maintain your account</li>
            <li>Generate personalized study suggestions and recommendations</li>
            <li>Send notifications and updates about your tasks and deadlines</li>
            <li>Analyze usage patterns to enhance user experience</li>
            <li>Respond to your comments, questions, and requests</li>
            <li>Monitor and analyze trends and usage of our application</li>
          </ul>
        </section>
        
        <section className="legal-section">
          <h2>4. Sharing Your Information</h2>
          <p>We do not sell, trade, rent, or transfer your personal information to third parties without your consent, except in the following circumstances:</p>
          <ul>
            <li><strong>Service Providers:</strong> We may share your information with third-party vendors who perform services on our behalf (e.g., hosting providers, analytics services).</li>
            <li><strong>Compliance with Laws:</strong> We may disclose your information when required by law or to protect our rights or the safety of our users.</li>
            <li><strong>Business Transfers:</strong> If LearnAI is involved in a merger, acquisition, or sale of assets, your information may be transferred as part of that transaction.</li>
          </ul>
        </section>
        
        <section className="legal-section">
          <h2>5. Data Security</h2>
          <p>
            We implement appropriate technical and organizational measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
          </p>
        </section>
        
        <section className="legal-section">
          <h2>6. Your Data Rights</h2>
          <p>Depending on your location, you may have certain rights regarding your personal information, including:</p>
          <ul>
            <li>The right to access your personal data</li>
            <li>The right to correct inaccurate personal data</li>
            <li>The right to delete your personal data</li>
            <li>The right to restrict or object to our processing of your personal data</li>
            <li>The right to data portability</li>
          </ul>
          <p>To exercise these rights, please contact us at hfyrk3@nottingham.edu.my.</p>
        </section>
        
        <section className="legal-section">
          <h2>7. Children's Privacy</h2>
          <p>
            Our application is not intended for individuals under the age of 16. We do not knowingly collect personal information from children under 16. If we learn that we have collected personal information from a child under 16, we will promptly delete that information.
          </p>
        </section>
        
        <section className="legal-section">
          <h2>8. Changes to This Privacy Policy</h2>
          <p>
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date. You are advised to review this Privacy Policy periodically for any changes.
          </p>
        </section>
        
        <section className="legal-section">
          <h2>9. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at:
          </p>
          <div className="contact-details">
            <p>Email: hfyrk3@nottingham.edu.my</p>
            <p>Phone: +60 182 857 242</p>
            <p>Address: University of Nottingham, Selangor, Malaysia</p>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Privacy;