import React, { useState } from 'react';
import styled from 'styled-components';
import StyledTerminal from '../styled-components/StyledTerminal';


const TerminalInputLine = styled.div`
    display: block;
    width: 100%;
`;

const Prompt = styled.span`
  color: green;
`;

const TerminalInput = styled.input`
    border: none;
    background: none;
    color: white;
    outline: none;
    font-family: inherit;
`;

const files: any = {
  documents: {
    math: 'ok',
  },
  source: {
    react: {
      'my-app': '',
    },
  },
};

type HistoryItem = {
  id: number,
  command: string,
  response: string | null,
};

type ResolveInput = {
    setPath: React.Dispatch<React.SetStateAction<string[]>>,
    setHistory: React.Dispatch<React.SetStateAction<HistoryItem[]>>,
    args: string[],
    path: string[],
    dir: any
}

type Command = {
    command: string,
    resolve: ({ setPath, setHistory, args }: ResolveInput) => string | null,
}

const commands: Command[] = [
  {
    command: 'cd',
    resolve: ({ args: [destination], setPath }) => {
      if (destination === '..') {
        setPath((prev) => prev.slice(0, prev.length - 1));
      } else {
        setPath((prev) => [...prev, destination]);
      }
      return null;
    },
  },
  {
    command: 'ls',
    resolve: ({ dir }) => Object.keys(dir).join('\n'),
  },
];

let id = 1;

const Terminal: React.FC = () => {
  const [input, setInput] = useState({
    prompt: '~',
    command: '',
  });
  const [path, setPath] = useState<string[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);


  const dir = path.reduce((acc, cur) => acc[cur], files);


  const handleSubmit = (e: React.FormEvent<Element>) => {
    e.preventDefault();
    const [command, ...args] = input.command.split(' ');

    id += 1;
    if (!commands.some((c) => c.command === command)) {
      setHistory((prev) => [...prev, { id, command: input.command, response: `Error: ${input} is not a command` }]);
      setInput({ prompt: '~', command: '' });
      return;
    }

    const response = commands.filter((c) => c.command === command)[0].resolve({
      setHistory, setPath, args, path, dir,
    });

    setHistory((prev) => [...prev, { id, command: input.command, response }]);

    setInput({ prompt: '~', command: '' });
  };
  return (
    <StyledTerminal>
      <form onSubmit={handleSubmit}>
        {history.map((h) => (
          <div key={h.id}>
            <p>{h.command}</p>
            <p>{h.response}</p>
          </div>
        ))}
        <TerminalInputLine>
          <Prompt>{input.prompt}</Prompt>
          <TerminalInput
            value={input.command}
            onChange={(e) => {
              const { value } = e.target;
              setInput((prev) => ({ ...prev, command: value }));
            }}
            autoFocus
          />
        </TerminalInputLine>
        <button type="submit" hidden>submit</button>
      </form>
    </StyledTerminal>
  );
};

export default Terminal;
