import { createContext, useContext, useState, ReactNode } from "react";

type DonationContextType = {
  amount: number | null;
  setAmount: (value: number | null) => void;
};

const DonationContext = createContext<DonationContextType>({
  amount: null,
  setAmount: () => {},
});

export const DonationProvider = ({ children }: { children: ReactNode }) => {
  const [amount, setAmount] = useState<number | null>(null);

  return (
    <DonationContext.Provider value={{ amount, setAmount }}>
      {children}
    </DonationContext.Provider>
  );
};

export const useDonation = () => useContext(DonationContext);
