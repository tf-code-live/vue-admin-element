<template>
    <div
        class="sidebar-logo-container"
        :class="{'collapse':collapse}"
    >
        <transition name="sidebarLogoFade">
            <router-link
                v-if="collapse"
                key="collapse"
                class="sidebar-logo-link"
                to="/"
            >
                <img
                    v-if="collapseLogo"
                    :src="collapseLogo"
                    class="sidebar-logo"
                >
                <h1
                    v-else
                    class="sidebar-title"
                >
                    {{ title }}
                </h1>
            </router-link>
            <router-link
                v-else
                key="expand"
                class="sidebar-logo-link"
                to="/"
            >
                <img
                    v-if="logo"
                    :src="logo"
                    class="sidebar-logo"
                >
            </router-link>
        </transition>
    </div>
</template>

<script>
export default {
    name: 'SidebarLogo',
    props: {
        collapse: {
            type: Boolean,
            required: true
        }
    },
    data() {
        return {
            title: 'Vue Admin Template',
            logo: require("@/assets/company.png"),
            collapseLogo: require("@/assets/cmb.png")
        }
    }
}
</script>

<style lang="scss" scoped>
.sidebarLogoFade-enter-active {
  transition: opacity 1.5s;
}

.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
  opacity: 0;
}

.sidebar-logo-container {
	position: relative;
	width: 100%;
	height: 40px;
	line-height: 40px;
	// background: #2b2f3a;
	background: #ffffff;
	text-align: center;
	overflow: hidden;

	&::after {
		content: '';
		position: absolute;
		width: 1px;
		height: 50%;
		top: 25%;
		right: 0;
		background: #dddddd;
	}

	& .sidebar-logo-link {
		height: 100%;
		width: 100%;

		& .sidebar-logo {
			// width: 32px;
			// height: 32px;
			width: 116px;
			height: 28px;
			line-height: 28px;
			vertical-align: middle;
		}

		& .sidebar-title {
			display: inline-block;
			margin: 0;
			color: #fff;
			font-weight: 600;
			line-height: 50px;
			font-size: 14px;
			font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
			vertical-align: middle;
		}
	}

	&.collapse {
		.sidebar-logo {
			width: 28px;
			height: 28px;
		}
	}
}
</style>
