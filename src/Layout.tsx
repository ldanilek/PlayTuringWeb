import { ReactNode } from "react";
import { GetStartedDialog } from "@/GetStarted/GetStartedDialog";

export function Layout({
  menu,
  children,
}: {
  menu?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="flex h-screen w-full flex-col">
      <header className="sticky top-0 z-10 flex min-h-20 border-b bg-background/80 backdrop-blur">
        <nav className="container w-full justify-between flex flex-row items-center gap-6">
          <div className="flex items-center gap-6 md:gap-10">
            <a href="/">
              <h1 className="text-base font-semibold">Play Turing</h1>
            </a>
            <div className="flex items-center gap-4 text-sm">
              <GetStartedDialog>
                <button className="text-muted-foreground transition-colors hover:text-foreground">
                  Help
                </button>
              </GetStartedDialog>
            </div>
          </div>
          {menu}
        </nav>
      </header>
      <main className="flex grow flex-col overflow-hidden">{children}</main>
    </div>
  );
}
