import { getServerSession } from "next-auth";
import Stripe from "stripe";
import { authOptions } from "../auth/[...nextauth]";

export default async function (req, res) {
  const session = await getServerSession(req, res, authOptions);

  if (session) {
    const stripe = new Stripe.Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2022-11-15",
    });
    const subscription = await stripe.subscriptions.search({
      query: `status:'active' AND metadata['customerEmail']:'${session.user?.email}'`,
    });

    res.status(200).json(subscription.data[0]);
  } else {
    res.status(401);
  }
}
