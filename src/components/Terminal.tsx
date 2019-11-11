import React, { useState } from 'react';
import styled from 'styled-components';
import StyledTerminal from '../styled-components/StyledTerminal';

const TerminalInput = styled.input`
    border: none;
    background: none;
    display: block;
    width: 100%;
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

type ResolveInput = {
    setPath: React.Dispatch<React.SetStateAction<string[]>>,
    setOutput: React.Dispatch<React.SetStateAction<string>>,
    args: string[],
    path: string[],
    dir: any
}

type Command = {
    command: string,
    resolve: ({ setPath, setOutput, args }: ResolveInput) => void,
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
    },
  },
  {
    command: 'ls',
    resolve: ({ setOutput, dir }) => {
      setOutput(Object.keys(dir).join('\n'));
    },
  },
];

const Terminal: React.FC = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [path, setPath] = useState<string[]>([]);

  const dir = path.reduce((acc, cur) => acc[cur], files);


  const handleSubmit = (e: React.FormEvent<Element>) => {
    e.preventDefault();
    const [command, ...args] = input.split(' ');

    commands.filter((c) => c.command === command)[0].resolve({
      setOutput, setPath, args, path, dir,
    });
  };
  return (
    <StyledTerminal>
      <form onSubmit={handleSubmit}>
        <TerminalInput value={input} onChange={(e) => setInput(e.target.value)} autoFocus />
        <p>{output}</p>
        <button type="submit" hidden>submit</button>
      </form>
    </StyledTerminal>
  );
};

export default Terminal;
