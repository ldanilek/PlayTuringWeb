import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ReactNode } from "react";
import './GetStartedDialog.css';

export function GetStartedDialog({ children }: { children: ReactNode }) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="dialog-content max-w-2xl max-h-[calc(100vh-8rem)] grid-rows-[1fr_auto] overflow-y-auto">
        <div className="flex flex-col gap-4">
          <h1>Write programs for a Turing Machine</h1>
            <p><a href="https://en.wikipedia.org/wiki/Turing_machine">Turing Machines</a> are computers that follow simple rules.</p>
            <ul>
              <li>They have a tape of characters</li>
              <li>They have a "head" that moves back and forth along the tape</li>
              <li>They have an internal state and can switch between them, like q0, q1, q2, ...</li>
              <li>They have rules. These are what you write! Each rule has two conditions and three actions:</li>
              <ul>
                <li>Conditions: rule activates based on the current internal state and the current character</li>
                <li>Actions: write a new character, switch to a new internal state, and move left or right</li>
              </ul>
            </ul>
          <p>Having trouble with the controls? Here's the solution for challenge 9:</p>
          <video src="/binary_add_1.mov" autoPlay muted loop />
        </div>
        <div className="flex flex-col gap-4">
          <h1>How to play</h1>
          <p>
            Each level wants you to write a set of rules that will transform the starting tape into the goal tape.
          </p>
          <p>
            Hit "Add Rule" to add new rules, then "Play" to run the machine, or "Step" to go one step at a time. If it gets into a state where there's no rule, you can add another rule from there.
          </p>
          <p>
            There is a pattern to each challenge, described in the title and any hints. Hit "Reload" to randomly generate a new challenge with the same pattern.
            You need to write rules that will work for any challenge with that pattern.
          </p>
          <p>
            For example, challenge 6 is "Bit flipper", the challenge is to write a set of rules that will flip all the 1s to 0s and vice versa.
            The rules to do so are simple (and described in the hints):
          </p>
          <p>q0, read 0 &rarr; q0, write 1, move right</p>
          <p>q0, read 1 &rarr; q0, write 0, move right</p>
          <p>Some challenges have a designated end state, and if it does you must finish in that state. For example, if the maximum start state is q5 and the maximum final state is q6, you must finish in state q6.</p>
          <p>Unlike theoretical Turing Machines, the tape is bounded so you can't go arbitrarily far left or right. Also the number of states is bounded, to increase the difficulty. How are your code golf skills?</p>
          <p>Higher numbered challenges are more difficult, but all are possible.</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
