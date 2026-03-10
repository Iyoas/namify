"use client";

import {
  forwardRef,
  useMemo,
  useState,
  type ChangeEvent,
  type FocusEvent,
  type InputHTMLAttributes,
} from "react";
import { useTypewriterPlaceholder } from "@/hooks/useTypewriterPlaceholder";
import styles from "./AnimatedPlaceholderInput.module.css";

type AnimatedPlaceholderInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "placeholder"
> & {
  phrases: string[];
  wrapperClassName?: string;
  overlayClassName?: string;
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseDuration?: number;
  nextPhraseDelay?: number;
};

function joinClassNames(...values: Array<string | undefined | false>) {
  return values.filter(Boolean).join(" ");
}

const AnimatedPlaceholderInput = forwardRef<
  HTMLInputElement,
  AnimatedPlaceholderInputProps
>(function AnimatedPlaceholderInput(
  {
    phrases,
    wrapperClassName,
    overlayClassName,
    className,
    value,
    defaultValue,
    onFocus,
    onBlur,
    onChange,
    typingSpeed,
    deletingSpeed,
    pauseDuration,
    nextPhraseDelay,
    ...inputProps
  },
  ref
) {
  const [isFocused, setIsFocused] = useState(false);
  const [uncontrolledValue, setUncontrolledValue] = useState(
    typeof defaultValue === "string" ? defaultValue : ""
  );

  const actualValue = useMemo(() => {
    if (typeof value === "string") return value;
    if (typeof value === "number") return String(value);
    return uncontrolledValue;
  }, [uncontrolledValue, value]);

  const animatedText = useTypewriterPlaceholder({
    phrases,
    enabled: !isFocused && actualValue.length === 0,
    typingSpeed,
    deletingSpeed,
    pauseDuration,
    nextPhraseDelay,
  });

  const hideOverlay = isFocused || actualValue.length > 0 || animatedText.length === 0;

  const handleFocus = (event: FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    onFocus?.(event);
  };

  const handleBlur = (event: FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    onBlur?.(event);
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (value === undefined) {
      setUncontrolledValue(event.target.value);
    }
    onChange?.(event);
  };

  return (
    <div className={joinClassNames(styles.root, wrapperClassName)}>
      <input
        {...inputProps}
        ref={ref}
        value={value}
        defaultValue={defaultValue}
        className={className}
        placeholder=""
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChange={handleChange}
      />
      <span
        aria-hidden="true"
        className={joinClassNames(
          styles.overlay,
          hideOverlay && styles.hidden,
          overlayClassName
        )}
      >
        {animatedText}
      </span>
    </div>
  );
});

export default AnimatedPlaceholderInput;
