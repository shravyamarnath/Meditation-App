import ThemeToggle from '../ThemeToggle';

export default function ThemeToggleExample() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-md mx-auto text-center">
        <h2 className="text-xl font-medium text-foreground mb-8">Theme Toggle</h2>
        <div className="flex justify-center mb-8">
          <ThemeToggle />
        </div>
        <p className="text-sm text-muted-foreground">
          Click the button above to toggle between light and dark themes
        </p>
      </div>
    </div>
  );
}