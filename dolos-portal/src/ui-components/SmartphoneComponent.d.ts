/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { FlexProps, IconProps, ImageProps, TextProps, ViewProps } from "@aws-amplify/ui-react";
export declare type EscapeHatchProps = {
    [elementHierarchy: string]: Record<string, unknown>;
} | null;
export declare type VariantValues = {
    [key: string]: string;
};
export declare type Variant = {
    variantValues: VariantValues;
    overrides: EscapeHatchProps;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type SmartphoneComponentOverridesProps = {
    SmartphoneComponent?: PrimitiveOverrideProps<ViewProps>;
    "Rectangle 25"?: PrimitiveOverrideProps<ViewProps>;
    "Bubble left"?: PrimitiveOverrideProps<FlexProps>;
    "Frame 2"?: PrimitiveOverrideProps<FlexProps>;
    "Rectangle 2104770"?: PrimitiveOverrideProps<ViewProps>;
    "Rectangle 1104771"?: PrimitiveOverrideProps<ViewProps>;
    "Rectangle 3104772"?: PrimitiveOverrideProps<ViewProps>;
    "Frame 1"?: PrimitiveOverrideProps<FlexProps>;
    Text?: PrimitiveOverrideProps<TextProps>;
    "Frame 3"?: PrimitiveOverrideProps<FlexProps>;
    "Rectangle 2104776"?: PrimitiveOverrideProps<ViewProps>;
    "Rectangle 1104777"?: PrimitiveOverrideProps<ViewProps>;
    Union?: PrimitiveOverrideProps<IconProps>;
    "Rectangle 3104779"?: PrimitiveOverrideProps<ViewProps>;
    "Vector 1"?: PrimitiveOverrideProps<IconProps>;
    "Chat bubble"?: PrimitiveOverrideProps<FlexProps>;
    "Ellipse 1"?: PrimitiveOverrideProps<IconProps>;
    Pex?: PrimitiveOverrideProps<ImageProps>;
    "Frame 6"?: PrimitiveOverrideProps<ViewProps>;
    "Taylor Swift"?: PrimitiveOverrideProps<TextProps>;
    "Polygon 1"?: PrimitiveOverrideProps<IconProps>;
    "Rectangle 6"?: PrimitiveOverrideProps<ViewProps>;
    "Polygon 2"?: PrimitiveOverrideProps<IconProps>;
} & EscapeHatchProps;
export declare type SmartphoneComponentProps = React.PropsWithChildren<Partial<ViewProps> & {
    overrides?: SmartphoneComponentOverridesProps | undefined | null;
}>;
export default function SmartphoneComponent(props: SmartphoneComponentProps): React.ReactElement;
