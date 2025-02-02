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
          <h1>About Turing Machines</h1>
        <p>
          A turing machine is the ultimate hypothetical computer, 
          but it operates under simple principles. 
          It has some states (q0, q1, q2, ...) and it reads from a tape 
          with some characters (-, 0, 1, ...).
        </p>
        <p>
          At each step, the machine follows rules. 
          Based on the current state and the current character, 
          the machine knows what rule to use. 
          The rule tells it to write a new character, 
          go to a new state, and move left or right on the tape.
        </p>
        <p>
          Using certain rules, a turing machine could do anything a supercomputer can do, 
          but programming that machine would be a hassle. 
          Some of the small procedures, like adding two numbers, 
          are simple enough to program. 
          Play Turing presents these simple programming challenges as levels, 
          so the player can learn how Turing Machines work 
          and develop algorithmic thinking.
        </p>
        </div>
        <div className="flex flex-col gap-4">
          <h1>How to play</h1>
          <p>
            Each level wants you to write a set of rules that will transform the starting tape into the goal tape.
          </p>
          <p>
            There is a pattern to the change, described in the title and any hints. Hit "Reload" to randomly generate a new challenge with the same pattern.
            You need to write rules that will work for any challenge with that pattern.
          </p>
          <p>
            For example, challenge 6 is "Bit flipper", the challenge is to write a set of rules that will flip all the 1s to 0s and vice versa.
            The rules to do so are simple (and described in the hints):
          </p>
          <p>q0,0 &rarr; q0,1,R</p>
          <p>q0,1 &rarr; q0,0,R</p>
          <p>Some challenges have a designated end state (e.g. if the maximum start state is q5 and the maximum final state is q6) and if it does you must finish in that state.</p>
          <p>Some challenges are difficult, but all are possible.</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
