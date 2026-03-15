import React from "react";

export function Input({
  className = "",
  type = "text",
  placeholder,
  value,
  onChange,
  name,
  required,
  disabled,
  autoFocus,
  ...rest
}) {
  // If value is undefined (uncontrolled usage via FormData/name),
  // don't pass value/onChange at all — let the DOM own it.
  // If value IS defined (controlled usage), pass both value + onChange.
  const controlledProps =
    value !== undefined
      ? { value: value ?? "", onChange: onChange ?? (() => {}) }
      : {};

  return (
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      required={required}
      disabled={disabled}
      autoFocus={autoFocus}
      {...controlledProps}
      className={[
        "w-full px-3.5 py-2.5 text-sm",
        "bg-white border border-slate-200 rounded-xl",
        "text-slate-900 placeholder:text-slate-400",
        "outline-none transition-all duration-200",
        "focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...rest}
    />
  );
}