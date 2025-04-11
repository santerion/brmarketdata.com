import { Navbar } from "@/components/Navbar"

export default function SmartZapTermsOfService() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
        <main className="flex-1 py-16 px-6">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold">Terms of Service</h1>
          <p>Welcome to our AI-powered WhatsApp bot! By using this service, you agree to the following terms and conditions:</p>

          <h2 className="text-2xl font-semibold">1. Use of the Service</h2>
          <ul className="list-disc pl-6">
            <li>The bot is an AI tool designed to assist users with any questions they may have.</li>
            <li>Responses are provided for <strong>informational purposes only</strong> and <strong>do not constitute professional advice</strong>.</li>
            <li>The bot is <strong>not a financial advisor</strong>, doctor, lawyer, or licensed professional in any field. Users should consult qualified professionals for specific matters.</li>
            <li>Use of the service is at the <strong>user’s sole responsibility</strong>, and users decide how to act based on the information provided.</li>
          </ul>

          <h2 className="text-2xl font-semibold">2. Disclaimer</h2>
          <p>The bot and its developers are <strong>not liable for any damages, losses, or issues</strong> arising from the use of the service or reliance on the information provided.</p>

          <h2 className="text-2xl font-semibold">3. Message History</h2>
          <ul className="list-disc pl-6">
            <li>The bot <strong>saves message history</strong> to improve interactions and provide more accurate, contextual responses.</li>
            <li>By using the service, you <strong>authorize the storage and use of this data</strong> to enhance the bot.</li>
          </ul>

          <h2 className="text-2xl font-semibold">4. Free Plan and Payment</h2>
          <ul className="list-disc pl-6">
            <li>The service offers a <strong>free plan with 100 messages</strong>.</li>
            <li>After reaching this limit, a <strong>Stripe payment link</strong> will be generated for a recurring monthly subscription.</li>
            <li>Non-payment will result in <strong>service suspension</strong> until resolved.</li>
            <li>Users may cancel the subscription at any time, with no refunds for already-paid periods.</li>
          </ul>

          <h2 className="text-2xl font-semibold">5. Continuous Improvement</h2>
          <p>The bot is <strong>constantly being improved</strong> to enhance the user experience. Users acknowledge that the service is evolving.</p>

          <h2 className="text-2xl font-semibold">6. Changes to Terms</h2>
          <p>These Terms of Service may be updated. Continued use of the bot after changes implies acceptance of the new terms.</p>
        </div>
      </main>

      <footer className="py-6 px-6 border-t">
        <div className="max-w-7xl mx-auto text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Santerion. All rights reserved.
        </div>
      </footer>
    </div>
  );
}