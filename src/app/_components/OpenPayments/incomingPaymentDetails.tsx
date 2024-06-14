// Importing necessary components and icons
import { Button, Snippet } from "@nextui-org/react"; // Importing Button and Snippet components from @nextui-org/react
import { FaSpinner, FaCreditCard, FaMoneyBill } from "react-icons/fa"; // Importing specific icons from react-icons/fa
import { type IncomingPaymentWithPaymentMethods } from "@interledger/open-payments"; // Importing type definition for IncomingPaymentWithPaymentMethods from @interledger/open-payments

// Defining the IncomingPaymentDetails component
export default function IncomingPaymentDetails({
  incomingPaymentDetails, // Destructuring incomingPaymentDetails from props
}: {
  incomingPaymentDetails?: IncomingPaymentWithPaymentMethods; // Typing the incomingPaymentDetails prop as optional IncomingPaymentWithPaymentMethods
}) {
  return (
    <div className="flex flex-col"> {/* Main container with flex layout */}
      {/* Row for completed payment status */}
      <span className="grid grid-cols-3 items-center gap-2 pt-2 font-bold">
        <Button className="col col-span-1 justify-start" variant="light"> {/* Button with spinner icon and text */}
          <FaSpinner size={15} />
          Completed
        </Button>
        <div className="col-span-2"> {/* Displaying completion status */}
          {String(incomingPaymentDetails?.completed)}
        </div>nd 
      </span>
      
      {/* Row for payment address */}
      <span className="grid grid-cols-3 items-center gap-2 pt-2 font-bold">
        <Button className="col col-span-1 justify-start" variant="light"> {/* Button with credit card icon and text */}
          <FaCreditCard size={15} />
          Payment Address
        </Button>
        <Snippet className="col-span-2" color="primary"> {/* Displaying wallet address */}
          {incomingPaymentDetails?.walletAddress}
        </Snippet>
      </span>
      
      {/* Row for incoming amount */}
      <span className="grid grid-cols-3 items-center gap-2 pt-2 font-bold">
        <Button className="col col-span-1 justify-start" variant="light"> {/* Button with money bill icon and text */}
          <FaMoneyBill size={15} />
          Incoming Amount
          {" - " + incomingPaymentDetails?.incomingAmount?.assetCode ?? ""} {/* Displaying asset code if available */}
        </Button>
        <div className="col-span-2"> {/* Displaying incoming amount value */}
          {incomingPaymentDetails?.incomingAmount?.value}
        </div>
      </span>
      
      {/* Row for received amount */}
      <span className="grid grid-cols-3 items-center gap-2 pt-2 font-bold">
        <Button className="col col-span-1 justify-start" variant="light"> {/* Button with money bill icon and text */}
          <FaMoneyBill size={15} />
          Received Amount{" "}
          {" - " + incomingPaymentDetails?.receivedAmount?.assetCode ?? ""} {/* Displaying asset code if available */}
        </Button>
        <div className="col-span-2"> {/* Displaying received amount value */}
          {incomingPaymentDetails?.receivedAmount?.value}
        </div>
      </span>
    </div>
  );
}