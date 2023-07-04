import tw, { styled } from "twin.macro";
import { useState } from "react";
import { IconDefinition } from "@fortawesome/fontawesome-common-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export interface StepNavProps {
  step: number;
}

export const StepNav = ({ step }: StepNavProps) => {
  return (
    <Container show={step < 5}>
      <Nav>
        <CircleContainer>
          <Circle highlighted={step === 0} completed={step > 0} />
          <CircleDesc highlighted={step === 0}>Confirm Clip</CircleDesc>
        </CircleContainer>
        <Line />
        <CircleContainer>
          <Circle highlighted={step === 1} completed={step > 1} />
          <CircleDesc highlighted={step === 1}>Select Template</CircleDesc>
        </CircleContainer>

        <Line />
        <CircleContainer>
          <Circle highlighted={step === 2} completed={step > 2} />
          <CircleDesc highlighted={step === 2}>Select Facecam</CircleDesc>
        </CircleContainer>

        <Line />
        <CircleContainer>
          <Circle highlighted={step === 3} completed={step > 3} />
          <CircleDesc highlighted={step === 3}>Select Main Content</CircleDesc>
        </CircleContainer>

        <Line />
        <CircleContainer>
          <Circle highlighted={step === 4} completed={step > 4} />
          <CircleDesc highlighted={step === 4}>Preview</CircleDesc>
        </CircleContainer>
      </Nav>
    </Container>
  );
};
const CircleContainer = tw.div`flex flex-col items-center`;
const CircleDesc = styled.small`
  ${tw`hidden lg:block absolute transform translate-y-2 lg:translate-y-5 text-center text-sm-sub`}
  ${(props: any) =>
    props.highlighted == true
      ? tw`block text-plue text-bg-sub`
      : tw`text-black-natural`}
`;
const Container = styled.div`
  ${tw`flex justify-center m-auto w-full mb-6`}
  ${(props: any) => (props.show ? tw`` : tw`hidden`)}
`;
const Icon = tw(FontAwesomeIcon)``;
const Circle = styled.div`
  ${tw`rounded-full h-2 lg:h-4 w-2 lg:w-4 grid grid-flow-row items-center justify-center bg-gray-1`}
  ${(props: any) => (props.highlighted == true ? tw`bg-plue` : tw``)}
    ${(props: any) => (props.completed == true ? tw`bg-plue` : tw``)}
`;
const Line = tw.div`border h-0 w-4 lg:w-10`;
const Nav = tw.div`flex flex-row items-center`;
