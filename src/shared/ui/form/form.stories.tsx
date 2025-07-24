import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Form, useFormContext } from "./index";
import { TextField } from "../text-field";
import { Button } from "../button";

const FormField = ({
  name,
  ...props
}: {
  name: string;
  rules?: import("./types").TValidationRules;
  [key: string]: unknown;
}) => {
  const { register, formState } = useFormContext();
  const field = register(name, props.rules);
  const error = formState.errors[name];

  return (
    <TextField
      {...props}
      name={field.name}
      value={(field.value as string) || ""}
      onChange={field.onChange}
      onBlur={field.onBlur}
      error={error?.message}
    />
  );
};

const meta: Meta<typeof Form> = {
  title: "shared / ui / form",
  component: Form,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const BasicForm: Story = {
  render: () => {
    const [submittedData, setSubmittedData] = useState<Record<
      string,
      unknown
    > | null>(null);

    return (
      <div style={{ width: "400px" }}>
        <Form
          onFinish={(data) => {
            setSubmittedData(data);
            console.log("Form submitted:", data);
          }}
          defaultValues={{
            username: "",
            email: "",
            message: "",
          }}
        >
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            <FormField
              name="username"
              label="Name"
              placeholder="Enter your name"
              rules={{ required: "Name is required" }}
              fullWidth
            />

            <FormField
              name="email"
              label="Email"
              type="email"
              placeholder="example@email.com"
              rules={{
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email format",
                },
              }}
              fullWidth
            />

            <FormField
              name="message"
              label="Message"
              placeholder="Enter your message..."
              helperText="Optional field"
              fullWidth
            />

            <Button type="submit" variant="primary" fullWidth>
              Submit
            </Button>
          </div>
        </Form>

        {submittedData && (
          <div
            style={{
              marginTop: "1rem",
              padding: "1rem",
              backgroundColor: "#f0f0f0",
              borderRadius: "4px",
            }}
          >
            <h4>Submitted data:</h4>
            <pre>{JSON.stringify(submittedData, null, 2)}</pre>
          </div>
        )}
      </div>
    );
  },
};

export const LoginForm: Story = {
  render: () => {
    const [submittedData, setSubmittedData] = useState<Record<
      string,
      unknown
    > | null>(null);

    return (
      <div style={{ width: "350px" }}>
        <Form
          onFinish={(data) => {
            setSubmittedData(data);
            console.log("Login submitted:", data);
          }}
          defaultValues={{
            email: "",
            password: "",
          }}
        >
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            <h2 style={{ margin: "0 0 1rem 0", textAlign: "center" }}>Login</h2>

            <FormField
              name="email"
              label="Email"
              type="email"
              placeholder="example@email.com"
              rules={{
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email format",
                },
              }}
              fullWidth
            />

            <FormField
              name="password"
              label="Password"
              type="password"
              placeholder="Enter password"
              rules={{
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              }}
              fullWidth
            />

            <Button type="submit" variant="primary" fullWidth>
              Login
            </Button>
          </div>
        </Form>

        {submittedData && (
          <div
            style={{
              marginTop: "1rem",
              padding: "1rem",
              backgroundColor: "#f0f0f0",
              borderRadius: "4px",
            }}
          >
            <h4>Login data:</h4>
            <pre>{JSON.stringify(submittedData, null, 2)}</pre>
          </div>
        )}
      </div>
    );
  },
};

export const RegistrationForm: Story = {
  render: () => {
    const [submittedData, setSubmittedData] = useState<Record<
      string,
      unknown
    > | null>(null);

    return (
      <div style={{ width: "400px" }}>
        <Form
          onFinish={(data) => {
            setSubmittedData(data);
            console.log("Registration submitted:", data);
          }}
          defaultValues={{
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            confirmPassword: "",
          }}
        >
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            <h2 style={{ margin: "0 0 1rem 0", textAlign: "center" }}>
              Registration
            </h2>

            <div style={{ display: "flex", gap: "0.5rem" }}>
              <FormField
                name="firstName"
                label="First name"
                placeholder="Enter first name"
                rules={{ required: "First name is required" }}
                fullWidth
              />

              <FormField
                name="lastName"
                label="Last name"
                placeholder="Enter last name"
                rules={{ required: "Last name is required" }}
                fullWidth
              />
            </div>

            <FormField
              name="email"
              label="Email"
              type="email"
              placeholder="example@email.com"
              rules={{
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email format",
                },
              }}
              fullWidth
            />

            <FormField
              name="password"
              label="Password"
              type="password"
              placeholder="Enter password"
              rules={{
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters",
                },
              }}
              helperText="Minimum 8 characters"
              fullWidth
            />

            <FormField
              name="confirmPassword"
              label="Confirm password"
              type="password"
              placeholder="Confirm password"
              rules={{
                required: "Confirm password is required",
                validate: (value: unknown) => {
                  const { control } = useFormContext();
                  const formValues = control.getValues();
                  if (value !== formValues.password) {
                    return "Passwords do not match";
                  }
                  return true;
                },
              }}
              fullWidth
            />

            <Button type="submit" variant="primary" fullWidth>
              Register
            </Button>
          </div>
        </Form>

        {submittedData && (
          <div
            style={{
              marginTop: "1rem",
              padding: "1rem",
              backgroundColor: "#f0f0f0",
              borderRadius: "4px",
            }}
          >
            <h4>Registration data:</h4>
            <pre>{JSON.stringify(submittedData, null, 2)}</pre>
          </div>
        )}
      </div>
    );
  },
};

export const ValidatedForm: Story = {
  render: () => {
    const [submittedData, setSubmittedData] = useState<Record<
      string,
      unknown
    > | null>(null);

    return (
      <div style={{ width: "400px" }}>
        <Form
          onFinish={(data) => {
            setSubmittedData(data);
            console.log("Validated form submitted:", data);
          }}
          defaultValues={{
            username: "",
            email: "",
            age: "",
            website: "",
          }}
        >
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            <h2 style={{ margin: "0 0 1rem 0", textAlign: "center" }}>
              Form with validation
            </h2>

            <FormField
              name="username"
              label="Username"
              placeholder="Only letters and numbers"
              rules={{
                required: "Username is required",
                minLength: {
                  value: 3,
                  message: "Minimum 3 characters",
                },
                pattern: {
                  value: /^[a-zA-Z0-9]+$/,
                  message: "Only letters and numbers",
                },
              }}
              fullWidth
            />

            <FormField
              name="email"
              label="Email"
              type="email"
              placeholder="example@email.com"
              rules={{
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email format",
                },
              }}
              fullWidth
            />

            <FormField
              name="age"
              label="Age"
              type="number"
              placeholder="Enter your age"
              rules={{
                required: "Age is required",
                min: {
                  value: 18,
                  message: "Minimum age is 18",
                },
                max: {
                  value: 120,
                  message: "Maximum age is 120",
                },
              }}
              fullWidth
            />

            <FormField
              name="website"
              label="Website"
              type="url"
              placeholder="https://example.com"
              rules={{
                pattern: {
                  value: /^https?:\/\/.+/,
                  message:
                    "Enter a valid URL (starting with http:// or https://)",
                },
              }}
              helperText="Optional field"
              fullWidth
            />

            <Button type="submit" variant="primary" fullWidth>
              Submit
            </Button>
          </div>
        </Form>

        {submittedData && (
          <div
            style={{
              marginTop: "1rem",
              padding: "1rem",
              backgroundColor: "#f0f0f0",
              borderRadius: "4px",
            }}
          >
            <h4>Validated data:</h4>
            <pre>{JSON.stringify(submittedData, null, 2)}</pre>
          </div>
        )}
      </div>
    );
  },
};
