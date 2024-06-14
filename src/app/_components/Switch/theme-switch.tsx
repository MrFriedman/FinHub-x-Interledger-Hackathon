"use client";
// "use client" directive ensures that this module is treated as client-side code

import { FC } from "react"; // Importing Function Component type from React
import { VisuallyHidden } from "@react-aria/visually-hidden"; // Importing VisuallyHidden component from @react-aria/visually-hidden
import { SwitchProps, useSwitch } from "@nextui-org/react"; // Importing SwitchProps type and useSwitch hook from @nextui-org/react
import { useTheme } from "next-themes"; // Importing useTheme hook from next-themes for theme management
import { useIsSSR } from "@react-aria/ssr"; // Importing useIsSSR hook to check if it's server-side rendering
import clsx from "clsx"; // Importing clsx for conditional class name concatenation

import { IoMdMoon, IoMdSunny } from "react-icons/io"; // Importing icons for moon and sun from react-icons

// Defining the props interface for the ThemeSwitch component
export interface ThemeSwitchProps {
  className?: string; // Optional className prop
  classNames?: SwitchProps["classNames"]; // Optional classNames prop, typed based on SwitchProps from nextui-org/react
}

// ThemeSwitch component definition
export const ThemeSwitch: FC<ThemeSwitchProps> = ({
  className,
  classNames,
}) => {
  const { theme, setTheme } = useTheme(); // Using useTheme hook to get and set the current theme
  const isSSR = useIsSSR(); // Using useIsSSR hook to determine if it's server-side rendering

  // Function to handle theme change
  const onChange = () => {
    theme === "light" ? setTheme("dark") : setTheme("light"); // Toggling theme between light and dark
  };

  // Using useSwitch hook to create a custom switch component
  const {
    Component, // The switch component
    slots, // Slots for various parts of the switch
    isSelected, // Whether the switch is selected (i.e., light theme is active)
    getBaseProps, // Function to get base props for the switch component
    getInputProps, // Function to get props for the input element
    getWrapperProps, // Function to get props for the wrapper element
  } = useSwitch({
    isSelected: theme === "light" || isSSR, // Initial selection state based on current theme or SSR
    "aria-label": `Switch to ${theme === "light" || isSSR ? "dark" : "light"} mode`, // Accessibility label for the switch
    onChange, // onChange handler for the switch
  });

  // Returning the switch component
  return (
    <Component
      {...getBaseProps({
        className: clsx(
          "px-px transition-opacity hover:opacity-80 cursor-pointer", // Base styles for the switch component
          className, // Additional className prop
          classNames?.base, // Additional base classNames prop
        ),
      })}
    >
      <VisuallyHidden>
        <input {...getInputProps()} /> {/* Visually hidden input element for accessibility */}
      </VisuallyHidden>
      <div
        {...getWrapperProps()}
        className={slots.wrapper({
          class: clsx(
            [
              "h-auto w-auto", // Auto height and width
              "bg-transparent", // Transparent background
              "rounded-lg", // Rounded corners
              "flex items-center justify-center", // Centered content
              "group-data-[selected=true]:bg-transparent", // Background when selected
              "!text-default-500", // Default text color
              "pt-px", // Padding-top
              "px-0", // No padding on the x-axis
              "mx-0", // No margin on the x-axis
            ],
            classNames?.wrapper, // Additional wrapper classNames prop
          ),
        })}
      >
        {!isSelected || isSSR ? ( // Render sun icon if not selected or SSR
          <IoMdSunny color="white" size={22} />
        ) : (
          <IoMdMoon color="black" size={22} /> // Render moon icon if selected
        )}
      </div>
    </Component>
  );
};