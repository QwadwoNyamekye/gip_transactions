import { Component, OnDestroy, OnInit } from "@angular/core";
import {
  NbMediaBreakpointsService,
  NbMenuService,
  NbSidebarService,
  NbThemeService,
} from "@nebular/theme";
import { Router } from "@angular/router";
import { UserData } from "../../../@core/data/users";
import { LayoutService } from "../../../@core/utils";
import { map, takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";
import { NbAuthService } from "@nebular/auth";
import { NbAuthJWTToken } from "@nebular/auth";
import { APIService } from "../../../@core/mock/nec.service";

@Component({
  selector: "ngx-header",
  styleUrls: ["./header.component.scss"],
  templateUrl: "./header.component.html",
})
export class HeaderComponent implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();
  userPictureOnly: boolean = false;
  user: any;

  themes = [
    {
      value: "default",
      name: "Light",
    },
    {
      value: "dark",
      name: "Dark",
    },
    {
      value: "cosmic",
      name: "Cosmic",
    },
    {
      value: "corporate",
      name: "Corporate",
    },
  ];

  currentTheme = "default";

  userMenu = [{ title: "Log out" }];

  constructor(
    private sidebarService: NbSidebarService,
    private menuService: NbMenuService,
    private themeService: NbThemeService,
    private userService: UserData,
    private layoutService: LayoutService,
    private breakpointService: NbMediaBreakpointsService,
    private router: Router,
    private authService: NbAuthService,
    private service: APIService
  ) {
    this.authService.authenticate("email").subscribe((data: any) => {
      console.log("+++++++++++++++++");
      this.user = {
        name: this.service.user?.name,
        picture: "assets/images/default.jpg",
      };
    });
    this.authService.onTokenChange().subscribe((token: NbAuthJWTToken) => {
      console.log(token);
      // if (token.isValid()) {
      console.log("############################");
      // console.log(this.service.user);
      // this.user = {
      //   name: this.service.user.name,
      //   picture: "assets/images/default.jpg",
      // };
      // this.user = token.getPayload(); // here we receive a payload from the token and assigns it to our `user` variable
      // }
    });
  }

  ngOnInit() {
    this.currentTheme = this.themeService.currentTheme;
    const { xl } = this.breakpointService.getBreakpointsMap();
    this.themeService
      .onMediaQueryChange()
      .pipe(
        map(([, currentBreakpoint]) => currentBreakpoint.width < xl),
        takeUntil(this.destroy$)
      )
      .subscribe(
        (isLessThanXl: boolean) => (this.userPictureOnly = isLessThanXl)
      );

    this.themeService
      .onThemeChange()
      .pipe(
        map(({ name }) => name),
        takeUntil(this.destroy$)
      )
      .subscribe((themeName) => (this.currentTheme = themeName));

    this.menuService.onItemClick().subscribe((event) => {
      if (event.item.title === "Log out") {
        console.log("logout clicked");
        sessionStorage.clear();
        localStorage.clear();
        this.router.navigate(["auth/login"]);
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  changeTheme(themeName: string) {
    this.themeService.changeTheme(themeName);
  }

  toggleSidebar(): boolean {
    this.sidebarService.toggle(true, "menu-sidebar");
    this.layoutService.changeLayoutSize();

    return false;
  }

  navigateHome() {
    this.menuService.navigateHome();
    return false;
  }

  navigateViewOne() {
    this.router.navigate(["pages/charts/inward_outward"]);
  }
  navigateViewTwo() {
    this.router.navigate(["pages/charts/error_responses"]);
  }
  navigateViewThree() {
    this.router.navigate(["pages/charts/nec_ftc_ratio"]);
  }
  navigateViewFour() {
    this.router.navigate(["pages/charts/error_responses_table"]);
  }
  navigateViewFive() {
    this.router.navigate(["pages/charts/issuer_error_responses_table"]);
  }
  navigateViewSix() {
    this.router.navigate(["pages/charts/inward_outward_filtered"]);
  }
}
