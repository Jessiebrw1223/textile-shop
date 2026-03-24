import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import B2BSection from "@/components/B2BSection";

const CorporatePurchases = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24">
        <B2BSection />
      </main>
      <Footer />
    </div>
  );
};

export default CorporatePurchases;
