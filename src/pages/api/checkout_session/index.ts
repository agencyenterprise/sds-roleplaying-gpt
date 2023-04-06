import { getServerSession } from "next-auth";
import Stripe from "stripe";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req, res) {
  try {
    const session = await getServerSession(req, res, authOptions);
    const price = process.env.STRIPE_PRICE_ID!;

    if (session) {
      const stripe = new Stripe.Stripe(process.env.STRIPE_SECRET_KEY!, {
        apiVersion: "2022-11-15",
      });

      let customer = (
        await stripe.customers.list({
          email: session.user!.email!,
          limit: 1,
        })
      ).data.at(0);

      if (!customer) {
        customer = await stripe.customers.create({
          email: session.user!.email!,
        });
      }

      const checkoutSession = await stripe.checkout.sessions.create({
        mode: "subscription",
        payment_method_types: ["card"],
        customer: customer.id,
        line_items: [
          {
            price,
            quantity: 1,
          },
        ],
        subscription_data: {
          metadata: { customerEmail: customer.email },
        },

        success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/`,
        cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/failed`,
      });

      res.status(200).json({ payment_url: checkoutSession.url });
    } else {
      res.status(401);
    }
  } catch (err) {
    res.status(500).json(err);
  }
}
