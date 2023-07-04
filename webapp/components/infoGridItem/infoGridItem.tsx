import {IconDefinition} from "@fortawesome/fontawesome-common-types";
import tw from "twin.macro";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";


export interface InfoGridItemProps {
    id: number,
    title: string,
    desc: string,
    icon: IconDefinition,

}
export const InfoGridItem = ({id, title, desc, icon}: InfoGridItemProps) => {
    return(
        <Container>
            <IconBox>
                <Icon icon={icon}/>
            </IconBox>
            <TitleDesc>
            <Title>
                {title}
            </Title>
            <Description>
                {desc}
            </Description>
            </TitleDesc>
        </Container>
    )
};


const Container = tw.div`flex flex-row lg:flex-col items-start lg:items-center`
const IconBox = tw.div`bg-dplue p-3 rounded-full shadow-lg`
const Icon = tw(FontAwesomeIcon)`text-heading-3 text-white`;
const TitleDesc = tw.div`flex flex-col text-left lg:text-center ml-2 lg:m-0`;
const Title = tw.h1`text-heading-3 font-sans text-white mt-2`
const Description = tw.p`text-heading-5 font-sans text-white mt-2`