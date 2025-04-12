import { Navbar } from "@/components/Navbar"

export default function SmartZapPrivacyPolicy() {
	return (
    	<div className="min-h-screen flex flex-col">
        	<Navbar />
        	<main className="flex-1 py-16 px-6">
				<div className="space-y-4">
				<h1 className="text-3xl font-bold">Privacy Policy</h1>
				<p>Our Privacy Policy explains how your information is collected, used, and protected:</p>

				<h2 className="text-2xl font-semibold">1. Information Collection</h2>
				<p>The bot collects <strong>message history</strong> sent and received to improve interactions and provide more helpful responses.</p>

				<h2 className="text-2xl font-semibold">2. Use of Information</h2>
				<p>The information is used to:</p>
				<ul className="list-disc pl-6">
					<li>Enhance the bot’s artificial intelligence.</li>
					<li>Personalize responses based on conversation context.</li>
				</ul>
				<p>By using the service, you <strong>authorize sharing this data</strong> with third parties if necessary to improve the bot.</p>

				<h2 className="text-2xl font-semibold">3. Information Protection</h2>
				<p>Data is stored securely with measures to protect it from unauthorized access.</p>

				<h2 className="text-2xl font-semibold">4. Payment Information</h2>
				<p>For the paid plan, payment details are processed by <strong>Stripe</strong> and <strong>not stored by the bot</strong>.</p>

				<h2 className="text-2xl font-semibold">5. Access and Control</h2>
				<ul className="list-disc pl-6">
					<li>You may request access, correction, or deletion of your information at any time by sending a WhatsApp message.</li>
					<li>Deleting your history may limit the bot’s ability to provide contextual responses.</li>
				</ul>

				<h2 className="text-2xl font-semibold">6. Policy Changes</h2>
				<p>This Privacy Policy may be updated. Continued use of the service after changes implies acceptance of the new terms.</p>	
				</div>
			</main>

			<footer className="py-6 px-6 border-t">
				<div className="max-w-7xl mx-auto text-center text-sm text-muted-foreground">
				© {new Date().getFullYear()} BR Market Data. All rights reserved.
				</div>
			</footer>
    	</div>
  	);
}