import WhyUsCss from './WhyUs.module.css'

const WhyUs = () => {
  return (
    <div className={WhyUsCss.whyUs}>
      <div className={WhyUsCss.whyContainer}>
        <img
          src="/images/HeroSection/Icons/icons8-quality-96.png"
          alt="quality icon"
        />
        <div className={WhyUsCss.why}>
          <div className={WhyUsCss.title}>Parts & Accessories</div>
          <div className={WhyUsCss.subtitle}>Quality parts, right here.</div>
        </div>
      </div>
      <div className={WhyUsCss.whyContainer}>
        <img src="/images/HeroSection/Icons/icons8-truck-96.png" alt="" />
        <div className={WhyUsCss.why}>
          <div className={WhyUsCss.title}>Home Delivery</div>
          <div className={WhyUsCss.subtitle}>Parts right at your door</div>
        </div>
      </div>
      <div className={WhyUsCss.whyContainer}>
        <img src="/images/HeroSection/Icons/icons8-payments-64.png" alt="" />
        <div className={WhyUsCss.why}>
          <div className={WhyUsCss.title}>Easy Payments</div>
          <div className={WhyUsCss.subtitle}>Secure & Reliable</div>
        </div>
      </div>
      <div className={WhyUsCss.whyContainer}>
        <img
          src="/images/HeroSection/Icons/icons8-customer-support-96.png"
          alt=""
        />
        <div className={WhyUsCss.why}>
          <div className={WhyUsCss.title}>Customer Support</div>
          <div className={WhyUsCss.subtitle}>We're here to help</div>
        </div>
      </div>
    </div>
  );
}

export default WhyUs
