import * as React from "react";
export interface BreadcrumbHeaderProps {
  routes?: Array<any>;
  params?: any;
  breadcrumbList?: Array<{ title: React.ReactNode; href?: string }>;
  linkElement?: React.ReactNode;
}

export default class BreadcrumbHeader extends React.Component<BreadcrumbHeaderProps, any> {}
