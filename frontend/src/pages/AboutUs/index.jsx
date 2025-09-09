import React from 'react';
import './AboutUs.css';

const AboutUs = () => {
  return (
    <div className="about-us-container">
      <section className="about-header">
        <h1>About Us</h1>
        <p>
          Connecting you with trusted professionals for all your home service needs.
        </p>
      </section>

      <section className="about-mission">
        <h2>Our Mission</h2>
        <p>
          Our mission is to make your life easier by providing a reliable platform where you can find skilled professionals for all your home tasks, from cleaning to handyman services. We believe in creating opportunities for everyone and helping communities thrive by connecting people with the services they need.
        </p>
      </section>

      <section className="about-values">
        <h2>Our Values</h2>
        <div className="values-cards">
          <div className="value-card">
            <h3>Trust</h3>
            <p>
              We ensure that all service providers on our platform are vetted and trustworthy so that you can feel safe and secure using our services.
            </p>
          </div>
          <div className="value-card">
            <h3>Quality</h3>
            <p>
              We focus on providing top-quality services through experienced and reliable professionals. Your satisfaction is our priority.
            </p>
          </div>
          <div className="value-card">
            <h3>Convenience</h3>
            <p>
              Whether you need a cleaner, a plumber, or a handyman, we’ve made it easy to book the right professional at a time that suits you.
            </p>
          </div>
        </div>
      </section>

      <section className="about-story">
        <h2>Our Story</h2>
        <p>
          Started in [Year], we wanted to create a platform that made it simple for people to find skilled and reliable help with everyday tasks. From humble beginnings, we’ve grown into a trusted name for home services, helping thousands of customers across [Country/City] complete their to-do lists.
        </p>
      </section>

      <section className="about-team">
        <h2>Meet Our Team</h2>
        <div className="team-grid">
          <div className="team-member">
            <img src="https://www.bing.com/th/id/OIP.OESNjjem3bSfkIKKfJXEzwHaHa?w=204&h=211&c=8&rs=1&qlt=70&o=7&cb=thws4&dpr=1.3&pid=3.1&rm=3" alt="Team Member 1" />
            <h3>John Doe</h3>
            <p>Founder & CEO</p>
          </div>
          <div className="team-member">
            <img src="https://thfvnext.bing.com/th/id/OIP.xb20sw5ix--UUOwn8BhS8AHaHa?w=189&h=189&c=7&r=0&o=7&cb=thfvnext&pid=1.7&rm=3" alt="Team Member 2" />
            <h3>Jane Smith</h3>
            <p>Chief Operating Officer</p>
          </div>
          <div className="team-member">
            <img src="https://thfvnext.bing.com/th/id/OIP.Ez7AYlOBWvgs8mHYKEtJhQHaFk?w=234&h=180&c=7&r=0&o=7&cb=thfvnext&pid=1.7&rm=3" alt="Team Member 3" />
            <h3>Sarah Williams</h3>
            <p>Marketing Lead</p>
          </div>
          <div className="team-member">
            <img src="https://thfvnext.bing.com/th/id/OIP.b4HrtVtjRDNj2SH9IB8OrAHaHa?w=189&h=189&c=7&r=0&o=7&cb=thfvnext&pid=1.7&rm=3" alt="Team Member 4" />
            <h3>Mike Johnson</h3>
            <p>Head of Technology</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;