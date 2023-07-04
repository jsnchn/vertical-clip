import React, { useState } from "react";
import tw, { styled } from "twin.macro";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

export interface ModalProps {
  show: boolean;
  title?: string;
  onChange: (event: boolean) => any;
  children: React.ReactNode;
}

export const Modal = ({ show, title, onChange, children }: ModalProps) => {
  const childrenWithProps = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, {
        show: "bar",
      });
    }
  });
  if (show)
    return (
      <OuterOuter show={show}>
        <Outer show={show}>
          <Inner>
            <Content>
              <Close
                onClick={() => {
                  onChange(!show);
                }}
              >
                <XOut>
                  <Icon icon={faTimes} />
                </XOut>
              </Close>
              <Body>{childrenWithProps}</Body>
            </Content>
          </Inner>
        </Outer>
      </OuterOuter>
    );
  return <div></div>;
};

// Eventually add backdrop to this :)
const OuterOuter = styled.div`
  ${tw``}
  ${(props: any) => (props.show ? tw`` : tw``)}
`;
const Outer = styled.div`
  ${tw`w-full lg:w-1/2 justify-center top-1/8 overflow-x-hidden overflow-y-auto fixed lg:inset-1/8 z-40 outline-none focus:outline-none m-auto`}
  ${(props: any) => (props.show ? tw`` : tw`hidden`)}
`;

const Content = tw.div`rounded-lg shadow-lg relative flex flex-col outline-none focus:outline-none bg-white`;
const Inner = tw.div`relative my-2 bg-color-primary border-0 rounded`;
const Close = tw.button`absolute top-0 right-0 m-2 bg-transparent border-0 text-text-primary float-right z-10 text-3xl font-semibold outline-none focus:outline-none`;
const XOut = tw.span`bg-transparent text-gray-2 p-2 text-heading-2 font-thin outline-none focus:outline-none`;
const Body = tw.div`relative p-2`;
const Icon = tw(FontAwesomeIcon)`font-semibold ml-1`;
