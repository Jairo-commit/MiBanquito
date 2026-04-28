import { describe, it, expect } from "vitest";
import { renderWithProviders, screen } from "~/test/testUtils";
import { SplitLayout } from "./splitLayout";

describe("SplitLayout", () => {
    it("renders both panels with default leftWidth", () => {
        renderWithProviders(<SplitLayout left={<span>Left</span>} right={<span>Right</span>} />);

        expect(screen.getByTestId("splitlayout-left")).toBeInTheDocument();
        expect(screen.getByTestId("splitlayout-right")).toBeInTheDocument();
    });

    it("renders both panels with a custom leftWidth", () => {
        renderWithProviders(
            <SplitLayout left={<span>Left</span>} right={<span>Right</span>} leftWidth={70} />
        );

        expect(screen.getByTestId("splitlayout-left")).toBeInTheDocument();
        expect(screen.getByTestId("splitlayout-right")).toBeInTheDocument();
    });
});
