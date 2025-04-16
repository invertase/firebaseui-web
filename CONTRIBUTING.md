# Contributing to FirebaseUI

Thankyou for your interest in contributing to FirebaseUI! This project is structured as a monorepo using pnpm workspaces, and supports multiple packages including core logic, styles, and framework-specific bindings (React, Angular, etc.).

Below are the key steps to get up and running for local development, contributing and running example applications.

## Getting Started

This repository uses pnpm workspaces, so make sure you have pnpm installed:

```bash
npm install -g pnpm
```

Then install all dependencies at the root:

```bash
pnpm install
```

## Build All Packages

To build the entire FirebaseUI stack for React and Next.js examples:

```bash
pnpm build
```

## Running Example Applications

The example folder contains framework specific examples. Angular can be found under the `packages/angular` directory.

## Prerequistes

Before running any example applications, make sure the Firebase Emulator Suite is running.

```bash
firebase emulators:start
```

### Install the Firebase CLI (if you haven't already)

```bash
npm install -g firebase-tools
```

### Start the emulator

From the root of the repository:

```bash
firebase emulators:start
```

### NextJS

```bash
cd example/nextjs && pnpm dev
```

### Angular

```bash
cd packages/angular && pnpm start
```
