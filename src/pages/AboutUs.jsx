import React from "react";
import "../styles/AboutUsPage.module.css";

function AboutUsPage() {
  return (
    <div className="about-us-page">
      <h1>About LearnAI</h1>
      <p>
        LearnAI is a cutting-edge academic assistant platform designed to help students
        manage their tasks, track progress, and receive AI-driven study recommendations.
        Our mission is to empower students to achieve their academic goals with personalized
        tools and an intuitive interface.
      </p>
      <section className="team-section">
        <h2>Our Team</h2>
        <p>
          LearnAI was developed by a passionate group of students and professionals committed
          to enhancing the learning experience. With expertise in AI, machine learning, and
          user-centered design, our team is dedicated to creating innovative solutions for
          academic success.
        </p>
      </section>
      <section className="features-section">
        <h2>What We Offer</h2>
        <ul>
          <li>Task Management: Organize your academic workload efficiently.</li>
          <li>Progress Tracking: Visualize your performance with detailed insights.</li>
          <li>AI Recommendations: Receive tailored study tips and strategies.</li>
          <li>Calendar Integration: Stay on top of your deadlines and schedules.</li>
        </ul>
      </section>
      <section className="contact-section">
        <h2>Contact Us</h2>
        <p>
          If you'd like to learn more about LearnAI or have any questions, feel free to reach out
          to us at{" "}
          <a href="mailto:hfyrk3@nottingham.edu.my">hfyrk3@nottingham.edu.my</a>.
        </p>
      </section>
    </div>
  );
}

export default AboutUsPage;
