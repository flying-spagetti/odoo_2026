"use client";

import {
  Button,
  Dialog,
  Field,
  Input,
  NativeSelect,
  Portal,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import { LICENSE_CATEGORIES } from "../driver.schema";
import type { CreateDriverInput, DriverFailure } from "../driver.types";
import { DriverFailureAlert } from "./DriverFailureAlert";

const inputStyles = {
  bg: "gray.800",
  borderColor: "gray.700",
  color: "gray.100",
  _placeholder: { color: "gray.500" },
  _focusVisible: {
    borderColor: "blue.500",
    boxShadow: "0 0 0 1px var(--chakra-colors-blue-500)",
  },
};

function toDateInputValue(date: Date): string {
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function defaultExpiryDate(): string {
  const date = new Date();
  date.setFullYear(date.getFullYear() + 3);
  return toDateInputValue(date);
}

interface AddDriverDialogProps {
  open: boolean;
  isSubmitting: boolean;
  failure: DriverFailure | null;
  onOpenChange: (open: boolean) => void;
  onSubmit: (input: CreateDriverInput) => Promise<boolean>;
}

export function AddDriverDialog({
  open,
  isSubmitting,
  failure,
  onOpenChange,
  onSubmit,
}: AddDriverDialogProps) {
  const [name, setName] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [licenseCategory, setLicenseCategory] =
    useState<(typeof LICENSE_CATEGORIES)[number]>("HMV");
  const [licenseExpiryDate, setLicenseExpiryDate] = useState(defaultExpiryDate);
  const [contactNumber, setContactNumber] = useState("");
  const [localFailure, setLocalFailure] = useState<DriverFailure | null>(null);

  const displayedFailure = localFailure ?? failure;

  const resetForm = () => {
    setName("");
    setLicenseNumber("");
    setLicenseCategory("HMV");
    setLicenseExpiryDate(defaultExpiryDate());
    setContactNumber("");
    setLocalFailure(null);
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen && isSubmitting) {
      return;
    }
    if (!nextOpen) {
      resetForm();
    }
    onOpenChange(nextOpen);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    if (!name.trim()) {
      setLocalFailure({
        code: "VALIDATION_ERROR",
        message: "Driver name is required.",
      });
      return;
    }

    if (!licenseNumber.trim()) {
      setLocalFailure({
        code: "VALIDATION_ERROR",
        message: "Licence number is required.",
      });
      return;
    }

    if (!licenseExpiryDate) {
      setLocalFailure({
        code: "VALIDATION_ERROR",
        message: "Licence expiry date is required.",
      });
      return;
    }

    if (!contactNumber.trim()) {
      setLocalFailure({
        code: "VALIDATION_ERROR",
        message: "Contact number is required.",
      });
      return;
    }

    setLocalFailure(null);

    const succeeded = await onSubmit({
      name: name.trim(),
      licenseNumber: licenseNumber.trim(),
      licenseCategory,
      licenseExpiryDate: new Date(licenseExpiryDate).toISOString(),
      contactNumber: contactNumber.trim(),
    });

    if (succeeded) {
      resetForm();
      onOpenChange(false);
    }
  };

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(details) => handleOpenChange(details.open)}
      size="md"
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content bg="gray.900" borderColor="gray.700" borderWidth="1px">
            <Dialog.Header>
              <Dialog.Title color="gray.100">Add driver</Dialog.Title>
              <Dialog.CloseTrigger />
            </Dialog.Header>

            <Dialog.Body>
              <form onSubmit={handleSubmit} id="add-driver-form">
                <VStack align="stretch" gap="4">
                  <Text fontSize="sm" color="gray.400">
                    New drivers are registered as Available. Safety score is
                    calculated automatically from licence status and trip
                    history. Expired licences and Suspended status block trip
                    assignment.
                  </Text>

                  <Field.Root required>
                    <Field.Label fontSize="xs" color="gray.400">
                      NAME
                    </Field.Label>
                    <Input
                      value={name}
                      onChange={(event) => {
                        setName(event.target.value);
                        setLocalFailure(null);
                      }}
                      placeholder="Alex Kumar"
                      disabled={isSubmitting}
                      {...inputStyles}
                    />
                  </Field.Root>

                  <Field.Root required>
                    <Field.Label fontSize="xs" color="gray.400">
                      LICENCE NUMBER
                    </Field.Label>
                    <Input
                      value={licenseNumber}
                      onChange={(event) => {
                        setLicenseNumber(event.target.value.toUpperCase());
                        setLocalFailure(null);
                      }}
                      placeholder="AP-DL-2021-004512"
                      disabled={isSubmitting}
                      autoComplete="off"
                      {...inputStyles}
                    />
                  </Field.Root>

                  <Field.Root required>
                    <Field.Label fontSize="xs" color="gray.400">
                      LICENCE CATEGORY
                    </Field.Label>
                    <NativeSelect.Root disabled={isSubmitting}>
                      <NativeSelect.Field
                        value={licenseCategory}
                        onChange={(event) =>
                          setLicenseCategory(
                            event.target
                              .value as (typeof LICENSE_CATEGORIES)[number],
                          )
                        }
                        aria-label="Select licence category"
                        {...inputStyles}
                      >
                        {LICENSE_CATEGORIES.map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </NativeSelect.Field>
                      <NativeSelect.Indicator color="gray.400" />
                    </NativeSelect.Root>
                  </Field.Root>

                  <Field.Root required>
                    <Field.Label fontSize="xs" color="gray.400">
                      LICENCE EXPIRY
                    </Field.Label>
                    <Input
                      type="date"
                      value={licenseExpiryDate}
                      onChange={(event) => {
                        setLicenseExpiryDate(event.target.value);
                        setLocalFailure(null);
                      }}
                      disabled={isSubmitting}
                      {...inputStyles}
                    />
                  </Field.Root>

                  <Field.Root required>
                    <Field.Label fontSize="xs" color="gray.400">
                      CONTACT NUMBER
                    </Field.Label>
                    <Input
                      value={contactNumber}
                      onChange={(event) => {
                        setContactNumber(event.target.value);
                        setLocalFailure(null);
                      }}
                      placeholder="+91 98765 43210"
                      disabled={isSubmitting}
                      {...inputStyles}
                    />
                  </Field.Root>

                  <DriverFailureAlert failure={displayedFailure} />
                </VStack>
              </form>
            </Dialog.Body>

            <Dialog.Footer gap="3">
              <Button
                variant="outline"
                colorPalette="gray"
                disabled={isSubmitting}
                onClick={() => handleOpenChange(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                form="add-driver-form"
                colorPalette="blue"
                loading={isSubmitting}
              >
                Add driver
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}
