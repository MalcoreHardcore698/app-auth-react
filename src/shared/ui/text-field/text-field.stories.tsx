import type { Meta, StoryObj } from "@storybook/react-vite";

import { TextField } from "./index";

const meta: Meta<typeof TextField> = {
  title: "shared / ui / text-field",
  component: TextField,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: { type: "select" },
      options: ["outlined", "filled"],
    },
    size: {
      control: { type: "select" },
      options: ["small", "medium", "large"],
    },
    type: {
      control: { type: "select" },
      options: ["text", "email", "password", "number", "tel", "url"],
    },
    disabled: {
      control: { type: "boolean" },
    },
    loading: {
      control: { type: "boolean" },
    },
    fullWidth: {
      control: { type: "boolean" },
    },
    required: {
      control: { type: "boolean" },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "Input field",
    placeholder: "Enter text...",
  },
};

export const Outlined: Story = {
  args: {
    label: "Outlined field",
    placeholder: "Enter text...",
    variant: "outlined",
  },
};

export const Filled: Story = {
  args: {
    label: "Filled field",
    placeholder: "Enter text...",
    variant: "filled",
  },
};

export const WithError: Story = {
  args: {
    label: "Field with error",
    placeholder: "Enter text...",
    error: "This field is required",
    defaultValue: "Invalid value",
  },
};

export const WithHelperText: Story = {
  args: {
    label: "Field with helper text",
    placeholder: "Enter text...",
    helperText: "This is additional information for the user",
  },
};

export const Required: Story = {
  args: {
    label: "Required field",
    placeholder: "Enter text...",
    required: true,
  },
};

export const Small: Story = {
  args: {
    label: "Small field",
    placeholder: "Enter text...",
    size: "small",
  },
};

export const Medium: Story = {
  args: {
    label: "Medium field",
    placeholder: "Enter text...",
    size: "medium",
  },
};

export const Large: Story = {
  args: {
    label: "Large field",
    placeholder: "Enter text...",
    size: "large",
  },
};

export const Disabled: Story = {
  args: {
    label: "Disabled field",
    placeholder: "Enter text...",
    disabled: true,
    defaultValue: "Value",
  },
};

export const Loading: Story = {
  args: {
    label: "Loading field",
    placeholder: "Enter text...",
    loading: true,
  },
};

export const FullWidth: Story = {
  args: {
    label: "Full width field",
    placeholder: "Enter text...",
    fullWidth: true,
  },
  parameters: {
    layout: "padded",
  },
};

export const WithLeftIcon: Story = {
  args: {
    label: "Field with left icon",
    placeholder: "Search...",
    leading: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
        <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
      </svg>
    ),
  },
};

export const WithRightIcon: Story = {
  args: {
    label: "Field with right icon",
    placeholder: "Enter email...",
    type: "email",
    trailing: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
        <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2zm13 2.383-4.758 2.855L15 11.114v-5.73zm-.034 6.878L9.271 8.82 8 9.583 6.728 8.82l-5.694 3.44A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.739zM1 11.114l4.758-2.876L1 5.383v5.73z" />
      </svg>
    ),
  },
};

export const Password: Story = {
  args: {
    label: "Password",
    placeholder: "Enter password...",
    type: "password",
    required: true,
  },
};

export const Email: Story = {
  args: {
    label: "Email",
    placeholder: "example@email.com",
    type: "email",
    required: true,
  },
};

export const AllVariants: Story = {
  render: () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        width: "300px",
      }}
    >
      <TextField
        label="Outlined"
        variant="outlined"
        placeholder="Outlined variant"
      />
      <TextField label="Filled" variant="filled" placeholder="Filled variant" />
    </div>
  ),
  parameters: {
    layout: "padded",
  },
};

export const AllSizes: Story = {
  render: () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        width: "300px",
      }}
    >
      <TextField label="Small" size="small" placeholder="Small size" />
      <TextField label="Medium" size="medium" placeholder="Medium size" />
      <TextField label="Large" size="large" placeholder="Large size" />
    </div>
  ),
  parameters: {
    layout: "padded",
  },
};

export const FormExample: Story = {
  render: () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        width: "400px",
      }}
    >
      <TextField
        label="Name"
        placeholder="Enter your name"
        required
        fullWidth
      />
      <TextField
        label="Email"
        placeholder="example@email.com"
        type="email"
        required
        fullWidth
      />
      <TextField
        label="Password"
        placeholder="Enter password"
        type="password"
        required
        fullWidth
        helperText="Password must be at least 8 characters"
      />
      <TextField
        label="Confirm password"
        placeholder="Repeat password"
        type="password"
        required
        fullWidth
      />
    </div>
  ),
  parameters: {
    layout: "padded",
  },
};
