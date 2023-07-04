import React, { useEffect, useState } from "react";
import tw, { styled } from "twin.macro";


type MainLayoutProps = {
    children: React.ReactNode;
};

const MainLayout = ({ children }: MainLayoutProps) => {
    return (
        <ContentFree>
            {children}
        </ContentFree>
    );
};
export default MainLayout;

const ContentFree = tw.div`overflow-scroll bg-color-primary overflow-x-hidden h-screen`;