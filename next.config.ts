import type { NextConfig } from "next";
import { withProto } from "@proto-labs-inc/islands/next";

const config: NextConfig = { devIndicators: false };
export default withProto(config);
