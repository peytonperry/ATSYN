import { ActionIcon, Affix, Button, Transition } from '@mantine/core';
import { IconHeart } from '@tabler/icons-react';
//import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

export function ComputerVis(){
    return (
    <>
      <Affix position={{ bottom: 20, right: 20 }}>
        <Transition mounted>
          {(transitionStyles) => (
            <Button
              style={transitionStyles}
              radius="xl" 
              w={40}      
              h={40}      
              p={0}      
            >
              <ActionIcon
                // variant="gradient"
                // size="xl"
                // aria-label="Gradient action icon"
                // gradient={{ from: 'blue', to: 'cyan', deg: 90 }}
                ><IconHeart />
              </ActionIcon>
            </Button>
          )}
        </Transition>
      </Affix>
    </>
  );
}
